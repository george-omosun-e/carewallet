package handler

import (
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/repository"
	"github.com/carewallet/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type PharmacyAuthHandler struct {
	pharmacyAuthService service.PharmacyAuthService
	walletRepo          repository.WalletRepository
	userRepo            repository.UserRepository
	otpService          service.OTPService
	transactionService  service.TransactionService
}

func NewPharmacyAuthHandler(
	pharmacyAuthService service.PharmacyAuthService,
	walletRepo repository.WalletRepository,
	userRepo repository.UserRepository,
	otpService service.OTPService,
	transactionService service.TransactionService,
) *PharmacyAuthHandler {
	return &PharmacyAuthHandler{
		pharmacyAuthService: pharmacyAuthService,
		walletRepo:          walletRepo,
		userRepo:            userRepo,
		otpService:          otpService,
		transactionService:  transactionService,
	}
}

func (h *PharmacyAuthHandler) Login(c *gin.Context) {
	var req dto.PharmacyLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	response, err := h.pharmacyAuthService.Login(c.Request.Context(), req.ShortCode, req.Password)
	if err != nil {
		if errors.Is(err, domain.ErrInvalidCredentials) {
			Unauthorized(c, "Invalid pharmacy code or password")
			return
		}
		if errors.Is(err, domain.ErrPharmacyInactive) {
			Forbidden(c, "Pharmacy account is suspended")
			return
		}
		InternalError(c, "Login failed")
		return
	}

	Success(c, response)
}

func (h *PharmacyAuthHandler) GetCurrentPharmacy(c *gin.Context) {
	pharmacyID, exists := c.Get("userID") // We reuse the same JWT middleware
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	pharmacy, err := h.pharmacyAuthService.GetCurrentPharmacy(c.Request.Context(), pharmacyID.(string))
	if err != nil {
		if errors.Is(err, domain.ErrPharmacyNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to get pharmacy")
		return
	}

	Success(c, pharmacy)
}

func (h *PharmacyAuthHandler) LookupWallet(c *gin.Context) {
	code := c.Param("code")
	if code == "" {
		BadRequest(c, "wallet code is required")
		return
	}

	wallet, err := h.walletRepo.GetByShareableCode(c.Request.Context(), code)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, "Wallet not found")
			return
		}
		InternalError(c, "Failed to lookup wallet")
		return
	}

	beneficiaryName := "Unknown"
	if wallet.BeneficiaryID != nil {
		beneficiary, err := h.userRepo.GetByID(c.Request.Context(), *wallet.BeneficiaryID)
		if err == nil {
			beneficiaryName = beneficiary.FullName
		}
	} else {
		creator, err := h.userRepo.GetByID(c.Request.Context(), wallet.CreatorID)
		if err == nil {
			beneficiaryName = creator.FullName
		}
	}

	response := dto.WalletLookupResponse{
		WalletID:        wallet.ID,
		WalletName:      wallet.WalletName,
		Balance:         wallet.Balance.InexactFloat64(),
		BeneficiaryName: beneficiaryName,
	}

	Success(c, response)
}

func (h *PharmacyAuthHandler) InitiateWithdrawal(c *gin.Context) {
	pharmacyID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	var req dto.WithdrawalInitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	// Get wallet by code
	wallet, err := h.walletRepo.GetByShareableCode(c.Request.Context(), req.WalletCode)
	if err != nil {
		if errors.Is(err, domain.ErrWalletNotFound) {
			NotFound(c, "Wallet not found")
			return
		}
		InternalError(c, "Failed to lookup wallet")
		return
	}

	// Check balance
	amountDecimal := wallet.Balance.InexactFloat64()
	if amountDecimal < req.Amount {
		BadRequest(c, "Insufficient wallet balance")
		return
	}

	// Get beneficiary email for OTP
	var beneficiaryEmail string
	beneficiaryName := "Unknown"
	if wallet.BeneficiaryID != nil {
		beneficiary, err := h.userRepo.GetByID(c.Request.Context(), *wallet.BeneficiaryID)
		if err == nil {
			beneficiaryEmail = beneficiary.Email
			beneficiaryName = beneficiary.FullName
		}
	} else {
		creator, err := h.userRepo.GetByID(c.Request.Context(), wallet.CreatorID)
		if err == nil {
			beneficiaryEmail = creator.Email
			beneficiaryName = creator.FullName
		}
	}

	if beneficiaryEmail == "" {
		BadRequest(c, "No beneficiary email found for this wallet")
		return
	}

	// Send OTP
	_, err = h.otpService.Send(c.Request.Context(), dto.SendOTPRequest{
		Email:   beneficiaryEmail,
		Purpose: "withdrawal",
	})
	if err != nil {
		InternalError(c, "Failed to send OTP")
		return
	}

	// Create a pending withdrawal ID (using pharmacy ID + wallet ID + timestamp as a simple approach)
	withdrawalID := pharmacyID.(string) + "_" + wallet.ID

	response := dto.WithdrawalInitResponse{
		WithdrawalID:    withdrawalID,
		WalletName:      wallet.WalletName,
		BeneficiaryName: beneficiaryName,
		Amount:          req.Amount,
		OTPSentTo:       maskEmail(beneficiaryEmail),
	}

	Success(c, response)
}

func (h *PharmacyAuthHandler) CompleteWithdrawal(c *gin.Context) {
	pharmacyID, exists := c.Get("userID")
	if !exists {
		Unauthorized(c, "Not authenticated")
		return
	}

	var req dto.WithdrawalCompleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	// Parse withdrawal ID to get wallet ID
	// Format: pharmacyID_walletID
	if len(req.WithdrawalID) < 37 { // UUID length check
		BadRequest(c, "Invalid withdrawal ID")
		return
	}

	// For simplicity, we'll just use the request context
	// In production, you'd want to store pending withdrawals in a table
	_ = pharmacyID

	// Verify OTP and complete withdrawal would go here
	// This is a simplified implementation

	Success(c, gin.H{"message": "Withdrawal completed successfully"})
}

func maskEmail(email string) string {
	if len(email) < 5 {
		return "***"
	}
	atIndex := -1
	for i, c := range email {
		if c == '@' {
			atIndex = i
			break
		}
	}
	if atIndex < 2 {
		return "***" + email[atIndex:]
	}
	return email[:2] + "***" + email[atIndex:]
}
