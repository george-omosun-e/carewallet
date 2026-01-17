package dto

type SendOTPRequest struct {
	Email   string `json:"email" binding:"required,email"`
	Purpose string `json:"purpose" binding:"required,oneof=withdrawal email_verify password_reset"`
}

type VerifyOTPRequest struct {
	Email   string `json:"email" binding:"required,email"`
	Code    string `json:"code" binding:"required,len=6"`
	Purpose string `json:"purpose" binding:"required,oneof=withdrawal email_verify password_reset"`
}

type OTPResponse struct {
	Message string `json:"message"`
	Valid   bool   `json:"valid,omitempty"`
}
