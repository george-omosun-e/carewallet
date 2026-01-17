package dto

type CreateWalletRequest struct {
	WalletName    string  `json:"wallet_name" binding:"required"`
	Description   string  `json:"description,omitempty"`
	PhotoURL      string  `json:"photo_url,omitempty"`
	FundingGoal   float64 `json:"funding_goal,omitempty"`
	BeneficiaryID *string `json:"beneficiary_id,omitempty"`
}

type UpdateWalletRequest struct {
	WalletName  *string  `json:"wallet_name,omitempty"`
	Description *string  `json:"description,omitempty"`
	PhotoURL    *string  `json:"photo_url,omitempty"`
	FundingGoal *float64 `json:"funding_goal,omitempty"`
	Status      *string  `json:"status,omitempty"`
}

type WalletResponse struct {
	ID            string  `json:"id"`
	CreatorID     string  `json:"creator_id"`
	BeneficiaryID *string `json:"beneficiary_id,omitempty"`
	WalletName    string  `json:"wallet_name"`
	Description   string  `json:"description,omitempty"`
	PhotoURL      string  `json:"photo_url,omitempty"`
	Balance       float64 `json:"balance"`
	FundingGoal   float64 `json:"funding_goal,omitempty"`
	ShareableCode string  `json:"shareable_code"`
	Status        string  `json:"status"`
	CreatedAt     string  `json:"created_at"`
	UpdatedAt     string  `json:"updated_at"`
}

type PublicWalletResponse struct {
	ID            string  `json:"id"`
	WalletName    string  `json:"wallet_name"`
	Description   string  `json:"description,omitempty"`
	PhotoURL      string  `json:"photo_url,omitempty"`
	Balance       float64 `json:"balance"`
	FundingGoal   float64 `json:"funding_goal,omitempty"`
	ShareableCode string  `json:"shareable_code"`
}
