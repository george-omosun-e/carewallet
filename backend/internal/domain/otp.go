package domain

import (
	"time"
)

type OTPPurpose string

const (
	OTPPurposeWithdrawal     OTPPurpose = "withdrawal"
	OTPPurposeEmailVerify    OTPPurpose = "email_verify"
	OTPPurposePasswordReset  OTPPurpose = "password_reset"
)

type OTP struct {
	ID        string     `json:"id"`
	Email     string     `json:"email"`
	Code      string     `json:"-"`
	Purpose   OTPPurpose `json:"purpose"`
	ExpiresAt time.Time  `json:"expires_at"`
	Used      bool       `json:"used"`
	CreatedAt time.Time  `json:"created_at"`
}

func (o *OTP) IsExpired() bool {
	return time.Now().After(o.ExpiresAt)
}

func (o *OTP) IsValid(code string) bool {
	return !o.Used && !o.IsExpired() && o.Code == code
}
