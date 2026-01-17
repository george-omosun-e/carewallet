package domain

import (
	"time"

	"github.com/shopspring/decimal"
)

type WalletStatus string

const (
	WalletStatusActive   WalletStatus = "active"
	WalletStatusInactive WalletStatus = "inactive"
	WalletStatusClosed   WalletStatus = "closed"
)

type Wallet struct {
	ID            string          `json:"id"`
	CreatorID     string          `json:"creator_id"`
	BeneficiaryID *string         `json:"beneficiary_id,omitempty"`
	WalletName    string          `json:"wallet_name"`
	Description   string          `json:"description,omitempty"`
	PhotoURL      string          `json:"photo_url,omitempty"`
	Balance       decimal.Decimal `json:"balance"`
	FundingGoal   decimal.Decimal `json:"funding_goal,omitempty"`
	ShareableCode string          `json:"shareable_code"`
	Status        WalletStatus    `json:"status"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}

func (w *Wallet) CanBeAccessedBy(userID string) bool {
	if w.CreatorID == userID {
		return true
	}
	if w.BeneficiaryID != nil && *w.BeneficiaryID == userID {
		return true
	}
	return false
}

func (w *Wallet) CanBeDeleted() bool {
	return w.Balance.IsZero()
}
