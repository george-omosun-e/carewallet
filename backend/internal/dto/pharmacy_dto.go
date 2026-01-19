package dto

type PharmacyLoginRequest struct {
	ShortCode string `json:"short_code" binding:"required"`
	Password  string `json:"password" binding:"required"`
}

type PharmacyAuthResponse struct {
	Token    string           `json:"token"`
	Pharmacy PharmacyResponse `json:"pharmacy"`
}

type PharmacyResponse struct {
	ID                 string `json:"id"`
	Name               string `json:"name"`
	ShortCode          string `json:"short_code"`
	RegistrationNumber string `json:"registration_number"`
	Address            string `json:"address,omitempty"`
	Phone              string `json:"phone,omitempty"`
	Email              string `json:"email,omitempty"`
	Status             string `json:"status"`
}

type WalletLookupResponse struct {
	WalletID        string  `json:"wallet_id"`
	WalletName      string  `json:"wallet_name"`
	Balance         float64 `json:"balance"`
	BeneficiaryName string  `json:"beneficiary_name"`
}

type WithdrawalInitRequest struct {
	WalletCode string  `json:"wallet_code" binding:"required"`
	Amount     float64 `json:"amount" binding:"required,gt=0"`
}

type WithdrawalInitResponse struct {
	WithdrawalID    string  `json:"withdrawal_id"`
	WalletName      string  `json:"wallet_name"`
	BeneficiaryName string  `json:"beneficiary_name"`
	Amount          float64 `json:"amount"`
	OTPSentTo       string  `json:"otp_sent_to"`
}

type WithdrawalCompleteRequest struct {
	WithdrawalID string `json:"withdrawal_id" binding:"required"`
	OTPCode      string `json:"otp_code" binding:"required"`
}
