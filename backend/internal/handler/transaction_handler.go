package handler

import (
	"errors"
	"strconv"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	transactionService service.TransactionService
	otpService         service.OTPService
}

func NewTransactionHandler(transactionService service.TransactionService, otpService service.OTPService) *TransactionHandler {
	return &TransactionHandler{
		transactionService: transactionService,
		otpService:         otpService,
	}
}

func (h *TransactionHandler) Deposit(c *gin.Context) {
	walletID := c.Param("id")

	var req dto.DepositRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	transaction, err := h.transactionService.Deposit(c.Request.Context(), walletID, req)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrInvalidAmount) {
			BadRequest(c, err.Error())
			return
		}
		InternalError(c, "Failed to process deposit")
		return
	}

	Created(c, transaction)
}

func (h *TransactionHandler) Withdraw(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	userEmail, _ := c.Get("userEmail")

	var req dto.WithdrawalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	// Verify OTP first
	otpReq := dto.VerifyOTPRequest{
		Email:   userEmail.(string),
		Code:    req.OTPCode,
		Purpose: "withdrawal",
	}
	otpResp, err := h.otpService.Verify(c.Request.Context(), otpReq)
	if err != nil {
		InternalError(c, "Failed to verify OTP")
		return
	}
	if !otpResp.Valid {
		BadRequest(c, "Invalid or expired OTP")
		return
	}

	transaction, err := h.transactionService.Withdraw(c.Request.Context(), userID.(string), req)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrWalletAccessDenied) {
			Forbidden(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrInsufficientBalance) {
			BadRequest(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrPharmacyNotFound) || errors.Is(err, domain.ErrPharmacyInactive) {
			BadRequest(c, err.Error())
			return
		}
		InternalError(c, "Failed to process withdrawal")
		return
	}

	Created(c, transaction)
}

func (h *TransactionHandler) GetWalletTransactions(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	walletID := c.Param("id")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	transactions, err := h.transactionService.GetWalletTransactions(c.Request.Context(), userID.(string), walletID, page, pageSize)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrWalletAccessDenied) {
			Forbidden(c, err.Error())
			return
		}
		InternalError(c, "Failed to get transactions")
		return
	}

	Success(c, transactions)
}
