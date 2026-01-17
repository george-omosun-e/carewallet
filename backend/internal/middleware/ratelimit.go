package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	visitors map[string]*visitor
	mu       sync.RWMutex
	rate     int
	burst    int
	window   time.Duration
}

type visitor struct {
	tokens    int
	lastSeen  time.Time
	lastReset time.Time
}

func NewRateLimiter(rps int) *RateLimiter {
	rl := &RateLimiter{
		visitors: make(map[string]*visitor),
		rate:     rps,
		burst:    rps * 2,
		window:   time.Second,
	}

	// Start cleanup goroutine
	go rl.cleanupVisitors()

	return rl
}

func (rl *RateLimiter) cleanupVisitors() {
	for {
		time.Sleep(time.Minute)
		rl.mu.Lock()
		for ip, v := range rl.visitors {
			if time.Since(v.lastSeen) > 3*time.Minute {
				delete(rl.visitors, ip)
			}
		}
		rl.mu.Unlock()
	}
}

func (rl *RateLimiter) getVisitor(ip string) *visitor {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	v, exists := rl.visitors[ip]
	if !exists {
		v = &visitor{
			tokens:    rl.burst,
			lastSeen:  time.Now(),
			lastReset: time.Now(),
		}
		rl.visitors[ip] = v
		return v
	}

	v.lastSeen = time.Now()

	// Refill tokens based on time elapsed
	elapsed := time.Since(v.lastReset)
	if elapsed >= rl.window {
		tokensToAdd := int(elapsed / rl.window) * rl.rate
		v.tokens = min(v.tokens+tokensToAdd, rl.burst)
		v.lastReset = time.Now()
	}

	return v
}

func (rl *RateLimiter) Allow(ip string) bool {
	v := rl.getVisitor(ip)

	rl.mu.Lock()
	defer rl.mu.Unlock()

	if v.tokens > 0 {
		v.tokens--
		return true
	}

	return false
}

func RateLimit(rps int) gin.HandlerFunc {
	limiter := NewRateLimiter(rps)

	return func(c *gin.Context) {
		ip := c.ClientIP()

		if !limiter.Allow(ip) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "RATE_LIMITED",
					"message": "Too many requests. Please try again later.",
				},
			})
			return
		}

		c.Next()
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
