package handler

import (
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type WalletHandler struct {
	walletService service.WalletService
}

func NewWalletHandler(walletService service.WalletService) *WalletHandler {
	return &WalletHandler{walletService: walletService}
}

func (h *WalletHandler) Create(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	wallet, err := h.walletService.Create(c.Request.Context(), userID.(string), req)
	if err != nil {
		InternalError(c, "Failed to create wallet")
		return
	}

	Created(c, wallet)
}

func (h *WalletHandler) GetByID(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	walletID := c.Param("id")
	wallet, err := h.walletService.GetByID(c.Request.Context(), userID.(string), walletID)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrWalletAccessDenied) {
			Forbidden(c, err.Error())
			return
		}
		InternalError(c, "Failed to get wallet")
		return
	}

	Success(c, wallet)
}

func (h *WalletHandler) GetByShareableCode(c *gin.Context) {
	code := c.Param("code")
	wallet, err := h.walletService.GetByShareableCode(c.Request.Context(), code)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, "Wallet not found")
			return
		}
		InternalError(c, "Failed to get wallet")
		return
	}

	Success(c, wallet)
}

func (h *WalletHandler) GetUserWallets(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	wallets, err := h.walletService.GetUserWallets(c.Request.Context(), userID.(string))
	if err != nil {
		InternalError(c, "Failed to get wallets")
		return
	}

	Success(c, wallets)
}

func (h *WalletHandler) Update(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	walletID := c.Param("id")
	var req dto.UpdateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	wallet, err := h.walletService.Update(c.Request.Context(), userID.(string), walletID, req)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrWalletAccessDenied) {
			Forbidden(c, err.Error())
			return
		}
		InternalError(c, "Failed to update wallet")
		return
	}

	Success(c, wallet)
}

func (h *WalletHandler) Delete(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	walletID := c.Param("id")
	err := h.walletService.Delete(c.Request.Context(), userID.(string), walletID)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrWalletAccessDenied) {
			Forbidden(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrWalletHasBalance) {
			BadRequest(c, err.Error())
			return
		}
		InternalError(c, "Failed to delete wallet")
		return
	}

	Success(c, gin.H{"message": "Wallet deleted successfully"})
}
