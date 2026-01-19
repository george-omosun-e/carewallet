package domain

import "errors"

var (
	// User errors
	ErrUserNotFound       = errors.New("user not found")
	ErrUserAlreadyExists  = errors.New("user with this email already exists")
	ErrInvalidCredentials = errors.New("invalid email or password")

	// Wallet errors
	ErrWalletNotFound     = errors.New("wallet not found")
	ErrWalletAccessDenied = errors.New("you do not have access to this wallet")
	ErrWalletHasBalance   = errors.New("cannot delete wallet with remaining balance")
	ErrInvalidWalletCode  = errors.New("invalid wallet code")

	// Transaction errors
	ErrTransactionNotFound   = errors.New("transaction not found")
	ErrInsufficientBalance   = errors.New("insufficient wallet balance")
	ErrInvalidAmount         = errors.New("invalid amount")
	ErrTransactionFailed     = errors.New("transaction failed")

	// Pharmacy errors
	ErrPharmacyNotFound = errors.New("pharmacy not found")
	ErrPharmacyInactive = errors.New("pharmacy is not active")

	// Payment errors
	ErrPaymentNotFound     = errors.New("payment not found")
	ErrPaymentAlreadyVerified = errors.New("payment already verified")
	ErrPaymentFailed       = errors.New("payment failed")

	// OTP errors
	ErrOTPNotFound   = errors.New("OTP not found")
	ErrOTPExpired    = errors.New("OTP has expired")
	ErrOTPAlreadyUsed = errors.New("OTP has already been used")
	ErrInvalidOTP    = errors.New("invalid OTP")

	// Auth errors
	ErrTokenInvalid    = errors.New("invalid or expired token")
	ErrTokenBlacklisted = errors.New("token has been invalidated")
	ErrUnauthorized    = errors.New("unauthorized")
)
