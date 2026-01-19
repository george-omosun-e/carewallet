package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Environment           string
	Port                  string
	DatabaseURL           string
	JWTSecret             string
	JWTExpiration         time.Duration
	AllowedOrigins        []string
	RateLimitRPS          int
	OTPExpirationMinutes  int
	PlatformFeePercentage float64
	PaystackSecretKey     string
}

func Load() *Config {
	return &Config{
		Environment:           getEnv("ENVIRONMENT", "development"),
		Port:                  getEnv("PORT", "8080"),
		DatabaseURL:           getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/carewallet?sslmode=disable"),
		JWTSecret:             getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpiration:         time.Duration(getEnvAsInt("JWT_EXPIRATION_HOURS", 168)) * time.Hour,
		AllowedOrigins:        getEnvAsSlice("ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
		RateLimitRPS:          getEnvAsInt("RATE_LIMIT_RPS", 100),
		OTPExpirationMinutes:  getEnvAsInt("OTP_EXPIRATION_MINUTES", 10),
		PlatformFeePercentage: getEnvAsFloat("PLATFORM_FEE_PERCENTAGE", 0.04),
		PaystackSecretKey:     getEnv("PAYSTACK_SECRET_KEY", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvAsFloat(key string, defaultValue float64) float64 {
	if value, exists := os.LookupEnv(key); exists {
		if floatVal, err := strconv.ParseFloat(value, 64); err == nil {
			return floatVal
		}
	}
	return defaultValue
}

func getEnvAsSlice(key string, defaultValue []string) []string {
	if value, exists := os.LookupEnv(key); exists {
		return strings.Split(value, ",")
	}
	return defaultValue
}

func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}
