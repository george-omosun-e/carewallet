package dto

type DepositRequest struct {
	Amount             float64 `json:"amount" binding:"required,gt=0"`
	ContributorEmail   string  `json:"contributor_email,omitempty"`
	ContributorName    string  `json:"contributor_name,omitempty"`
	ContributorMessage string  `json:"contributor_message,omitempty"`
	PaystackReference  string  `json:"paystack_reference,omitempty"`
}

type WithdrawalRequest struct {
	WalletID   string  `json:"wallet_id" binding:"required"`
	Amount     float64 `json:"amount" binding:"required,gt=0"`
	PharmacyID string  `json:"pharmacy_id" binding:"required"`
	OTPCode    string  `json:"otp_code" binding:"required,len=6"`
}

type TransactionResponse struct {
	ID                 string  `json:"id"`
	WalletID           string  `json:"wallet_id"`
	Type               string  `json:"type"`
	Amount             float64 `json:"amount"`
	Fee                float64 `json:"fee"`
	NetAmount          float64 `json:"net_amount"`
	Status             string  `json:"status"`
	ContributorEmail   string  `json:"contributor_email,omitempty"`
	ContributorName    string  `json:"contributor_name,omitempty"`
	ContributorMessage string  `json:"contributor_message,omitempty"`
	PharmacyID         *string `json:"pharmacy_id,omitempty"`
	PharmacyName       string  `json:"pharmacy_name,omitempty"`
	PaystackReference  string  `json:"paystack_reference,omitempty"`
	CreatedAt          string  `json:"created_at"`
}

type TransactionListResponse struct {
	Transactions []TransactionResponse `json:"transactions"`
	Total        int                   `json:"total"`
	Page         int                   `json:"page"`
	PageSize     int                   `json:"page_size"`
}
