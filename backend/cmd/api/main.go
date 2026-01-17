package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/carewallet/backend/internal/config"
	"github.com/carewallet/backend/internal/handler"
	"github.com/carewallet/backend/internal/middleware"
	"github.com/carewallet/backend/internal/repository"
	"github.com/carewallet/backend/internal/service"
	"github.com/carewallet/backend/internal/utils"
	"github.com/carewallet/backend/pkg/database"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Set Gin mode
	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize database
	db, err := database.NewPostgresDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	log.Println("Connected to database")

	// Initialize JWT manager
	jwtManager := utils.NewJWTManager(cfg.JWTSecret, cfg.JWTExpiration)

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	walletRepo := repository.NewWalletRepository(db)
	transactionRepo := repository.NewTransactionRepository(db)
	pharmacyRepo := repository.NewPharmacyRepository(db)
	otpRepo := repository.NewOTPRepository(db)
	tokenBlacklistRepo := repository.NewTokenBlacklistRepository(db)

	// Initialize services
	emailService := service.NewMockEmailService()
	otpService := service.NewOTPService(otpRepo, emailService, cfg)
	authService := service.NewAuthService(userRepo, tokenBlacklistRepo, jwtManager, cfg)
	walletService := service.NewWalletService(walletRepo)
	transactionService := service.NewTransactionService(transactionRepo, walletRepo, pharmacyRepo, otpService, cfg)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	walletHandler := handler.NewWalletHandler(walletService)
	transactionHandler := handler.NewTransactionHandler(transactionService, otpService)
	otpHandler := handler.NewOTPHandler(otpService)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtManager, authService)

	// Create router
	router := gin.New()

	// Global middleware
	router.Use(gin.Recovery())
	router.Use(middleware.Logger())
	router.Use(middleware.CORS(cfg.AllowedOrigins))
	router.Use(middleware.RateLimit(cfg.RateLimitRPS))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		if err := db.Health(c.Request.Context()); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status":   "unhealthy",
				"database": "disconnected",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"status":   "healthy",
			"database": "connected",
		})
	})

	// API routes
	api := router.Group("/api/v1")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.Signup)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authMiddleware.RequireAuth(), authHandler.Logout)
			auth.GET("/me", authMiddleware.RequireAuth(), authHandler.GetCurrentUser)
		}

		// Wallet routes
		wallets := api.Group("/wallets")
		{
			// Public routes
			wallets.GET("/code/:code", walletHandler.GetByShareableCode)
			wallets.POST("/:id/deposit", transactionHandler.Deposit) // Anyone can contribute

			// Protected routes
			protected := wallets.Group("")
			protected.Use(authMiddleware.RequireAuth())
			protected.GET("", walletHandler.GetUserWallets)
			protected.GET("/:id", walletHandler.GetByID)
			protected.POST("", walletHandler.Create)
			protected.PUT("/:id", walletHandler.Update)
			protected.DELETE("/:id", walletHandler.Delete)
			protected.GET("/:id/transactions", transactionHandler.GetWalletTransactions)
		}

		// Withdrawal route (requires OTP)
		api.POST("/withdrawals", authMiddleware.RequireAuth(), transactionHandler.Withdraw)

		// OTP routes
		otp := api.Group("/otp")
		{
			otp.POST("/send", otpHandler.Send)
			otp.POST("/verify", otpHandler.Verify)
		}
	}

	// Create server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Printf("Server starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server stopped")
}
