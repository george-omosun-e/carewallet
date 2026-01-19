package domain

import (
	"time"

	"github.com/shopspring/decimal"
)

type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "pending"
	PaymentStatusCompleted PaymentStatus = "completed"
	PaymentStatusFailed    PaymentStatus = "failed"
)

type Payment struct {
	ID                string          `json:"id"`
	WalletID          string          `json:"wallet_id"`
	Reference         string          `json:"reference"`
	Amount            decimal.Decimal `json:"amount"`
	Email             string          `json:"email"`
	Message           string          `json:"message,omitempty"`
	Status            PaymentStatus   `json:"status"`
	PaystackReference string          `json:"paystack_reference,omitempty"`
	VerifiedAt        *time.Time      `json:"verified_at,omitempty"`
	CreatedAt         time.Time       `json:"created_at"`
	UpdatedAt         time.Time       `json:"updated_at"`
}
