package handler

import (
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/service"
	"github.com/carewallet/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var req dto.SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	response, err := h.authService.Signup(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, domain.ErrUserAlreadyExists) {
			Conflict(c, err.Error())
			return
		}
		InternalError(c, "Failed to create user")
		return
	}

	Created(c, response)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	response, err := h.authService.Login(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, domain.ErrInvalidCredentials) {
			Unauthorized(c, err.Error())
			return
		}
		InternalError(c, "Login failed")
		return
	}

	Success(c, response)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	jwtClaims := claims.(*utils.JWTClaims)
	err := h.authService.Logout(c.Request.Context(), jwtClaims.ID, jwtClaims.UserID, jwtClaims)
	if err != nil {
		InternalError(c, "Logout failed")
		return
	}

	Success(c, gin.H{"message": "Logged out successfully"})
}

func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	user, err := h.authService.GetCurrentUser(c.Request.Context(), userID.(string))
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to get user")
		return
	}

	Success(c, user)
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	err := h.authService.ChangePassword(c.Request.Context(), userID.(string), req)
	if err != nil {
		if errors.Is(err, domain.ErrInvalidCredentials) {
			BadRequest(c, "Current password is incorrect")
			return
		}
		if errors.Is(err, domain.ErrUserNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to change password")
		return
	}

	Success(c, gin.H{"message": "Password changed successfully"})
}
