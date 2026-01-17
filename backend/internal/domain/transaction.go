package domain

import (
	"time"

	"github.com/shopspring/decimal"
)

type TransactionType string
type TransactionStatus string

const (
	TransactionTypeDeposit    TransactionType = "deposit"
	TransactionTypeWithdrawal TransactionType = "withdrawal"
)

const (
	TransactionStatusPending   TransactionStatus = "pending"
	TransactionStatusCompleted TransactionStatus = "completed"
	TransactionStatusFailed    TransactionStatus = "failed"
)

type Transaction struct {
	ID                 string            `json:"id"`
	WalletID           string            `json:"wallet_id"`
	Type               TransactionType   `json:"type"`
	Amount             decimal.Decimal   `json:"amount"`
	Fee                decimal.Decimal   `json:"fee"`
	NetAmount          decimal.Decimal   `json:"net_amount"`
	Status             TransactionStatus `json:"status"`
	ContributorEmail   string            `json:"contributor_email,omitempty"`
	ContributorName    string            `json:"contributor_name,omitempty"`
	ContributorMessage string            `json:"contributor_message,omitempty"`
	PharmacyID         *string           `json:"pharmacy_id,omitempty"`
	PharmacyName       string            `json:"pharmacy_name,omitempty"`
	PaystackReference  string            `json:"paystack_reference,omitempty"`
	CreatedAt          time.Time         `json:"created_at"`
	UpdatedAt          time.Time         `json:"updated_at"`
}
