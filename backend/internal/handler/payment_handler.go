package handler

import (
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	paymentService service.PaymentService
}

func NewPaymentHandler(paymentService service.PaymentService) *PaymentHandler {
	return &PaymentHandler{paymentService: paymentService}
}

type InitializePaymentRequest struct {
	WalletID string  `json:"wallet_id" binding:"required"`
	Amount   float64 `json:"amount" binding:"required,gt=0"`
	Email    string  `json:"email" binding:"required,email"`
	Message  string  `json:"message"`
}

func (h *PaymentHandler) Initialize(c *gin.Context) {
	var req InitializePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	result, err := h.paymentService.InitializePayment(
		c.Request.Context(),
		req.WalletID,
		req.Email,
		req.Amount,
		req.Message,
	)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrWalletAccessDenied) {
			Forbidden(c, err.Error())
			return
		}
		InternalError(c, "Failed to initialize payment")
		return
	}

	Success(c, result)
}

func (h *PaymentHandler) Verify(c *gin.Context) {
	reference := c.Param("reference")
	if reference == "" {
		BadRequest(c, "reference is required")
		return
	}

	result, err := h.paymentService.VerifyPayment(c.Request.Context(), reference)
	if err != nil {
		if errors.Is(err, domain.ErrPaymentNotFound) {
			NotFound(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrPaymentAlreadyVerified) {
			Conflict(c, err.Error())
			return
		}
		if errors.Is(err, domain.ErrPaymentFailed) {
			Error(c, 400, "PAYMENT_FAILED", err.Error())
			return
		}
		InternalError(c, "Failed to verify payment")
		return
	}

	Success(c, result)
}
