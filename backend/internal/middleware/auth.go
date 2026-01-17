package middleware

import (
	"net/http"
	"strings"

	"github.com/carewallet/backend/internal/service"
	"github.com/carewallet/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
	jwtManager  *utils.JWTManager
	authService service.AuthService
}

func NewAuthMiddleware(jwtManager *utils.JWTManager, authService service.AuthService) *AuthMiddleware {
	return &AuthMiddleware{
		jwtManager:  jwtManager,
		authService: authService,
	}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Authorization header required",
				},
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Invalid authorization header format",
				},
			})
			return
		}

		tokenString := parts[1]
		claims, err := m.jwtManager.Validate(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Invalid or expired token",
				},
			})
			return
		}

		// Check if token is blacklisted
		blacklisted, err := m.authService.IsTokenBlacklisted(c.Request.Context(), claims.ID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "INTERNAL_ERROR",
					"message": "Failed to validate token",
				},
			})
			return
		}

		if blacklisted {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Token has been invalidated",
				},
			})
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("claims", claims)
		c.Next()
	}
}

func (m *AuthMiddleware) OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.Next()
			return
		}

		tokenString := parts[1]
		claims, err := m.jwtManager.Validate(tokenString)
		if err != nil {
			c.Next()
			return
		}

		blacklisted, _ := m.authService.IsTokenBlacklisted(c.Request.Context(), claims.ID)
		if blacklisted {
			c.Next()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("claims", claims)
		c.Next()
	}
}
