package handler

import (
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type OTPHandler struct {
	otpService service.OTPService
}

func NewOTPHandler(otpService service.OTPService) *OTPHandler {
	return &OTPHandler{otpService: otpService}
}

func (h *OTPHandler) Send(c *gin.Context) {
	var req dto.SendOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	response, err := h.otpService.Send(c.Request.Context(), req)
	if err != nil {
		InternalError(c, "Failed to send OTP")
		return
	}

	Success(c, response)
}

func (h *OTPHandler) Verify(c *gin.Context) {
	var req dto.VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	response, err := h.otpService.Verify(c.Request.Context(), req)
	if err != nil {
		InternalError(c, "Failed to verify OTP")
		return
	}

	Success(c, response)
}
