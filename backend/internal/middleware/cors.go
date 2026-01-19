package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CORS(allowedOrigins []string) gin.HandlerFunc {
	allowedOriginsMap := make(map[string]bool)
	var wildcardPatterns []string

	for _, origin := range allowedOrigins {
		if strings.Contains(origin, "*") {
			// Store wildcard patterns separately
			wildcardPatterns = append(wildcardPatterns, origin)
		} else {
			allowedOriginsMap[origin] = true
		}
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Check if origin is allowed (exact match or wildcard)
		allowed := allowedOriginsMap[origin] || allowedOriginsMap["*"]

		// Check wildcard patterns if not already allowed
		if !allowed {
			for _, pattern := range wildcardPatterns {
				if matchWildcard(pattern, origin) {
					allowed = true
					break
				}
			}
		}

		// Allow any origin if it looks like a valid URL (temporary debug)
		if !allowed && origin != "" {
			allowed = true
		}

		if allowed && origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
		} else if len(allowedOrigins) > 0 {
			// Default to first allowed origin if request origin not in list
			c.Header("Access-Control-Allow-Origin", allowedOrigins[0])
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// matchWildcard checks if origin matches a wildcard pattern like https://*.vercel.app
func matchWildcard(pattern, origin string) bool {
	// Handle patterns like https://*.vercel.app
	if !strings.Contains(pattern, "*") {
		return pattern == origin
	}

	// Split pattern into prefix and suffix around the wildcard
	parts := strings.SplitN(pattern, "*", 2)
	if len(parts) != 2 {
		return false
	}

	prefix := parts[0] // e.g., "https://"
	suffix := parts[1] // e.g., ".vercel.app"

	return strings.HasPrefix(origin, prefix) && strings.HasSuffix(origin, suffix)
}
