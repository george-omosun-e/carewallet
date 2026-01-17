package service

import (
	"context"
	"log"
	"time"

	"github.com/carewallet/backend/internal/config"
	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/repository"
	"github.com/carewallet/backend/internal/utils"
)

type OTPService interface {
	Send(ctx context.Context, req dto.SendOTPRequest) (*dto.OTPResponse, error)
	Verify(ctx context.Context, req dto.VerifyOTPRequest) (*dto.OTPResponse, error)
}

type EmailService interface {
	SendOTP(ctx context.Context, email, code string, purpose domain.OTPPurpose) error
}

type otpService struct {
	otpRepo      repository.OTPRepository
	emailService EmailService
	config       *config.Config
}

func NewOTPService(
	otpRepo repository.OTPRepository,
	emailService EmailService,
	cfg *config.Config,
) OTPService {
	return &otpService{
		otpRepo:      otpRepo,
		emailService: emailService,
		config:       cfg,
	}
}

func (s *otpService) Send(ctx context.Context, req dto.SendOTPRequest) (*dto.OTPResponse, error) {
	code, err := utils.GenerateOTPCode()
	if err != nil {
		return nil, err
	}

	otp := &domain.OTP{
		Email:     req.Email,
		Code:      code,
		Purpose:   domain.OTPPurpose(req.Purpose),
		ExpiresAt: time.Now().Add(time.Duration(s.config.OTPExpirationMinutes) * time.Minute),
		Used:      false,
	}

	if err := s.otpRepo.Create(ctx, otp); err != nil {
		return nil, err
	}

	// Send email (if email service is configured)
	if s.emailService != nil {
		if err := s.emailService.SendOTP(ctx, req.Email, code, otp.Purpose); err != nil {
			log.Printf("Failed to send OTP email: %v", err)
		}
	} else {
		// Log OTP for development
		log.Printf("OTP for %s: %s (purpose: %s)", req.Email, code, req.Purpose)
	}

	return &dto.OTPResponse{
		Message: "OTP sent successfully",
	}, nil
}

func (s *otpService) Verify(ctx context.Context, req dto.VerifyOTPRequest) (*dto.OTPResponse, error) {
	otp, err := s.otpRepo.GetLatestByEmailAndPurpose(ctx, req.Email, domain.OTPPurpose(req.Purpose))
	if err != nil {
		if err == domain.ErrOTPNotFound {
			return &dto.OTPResponse{
				Message: "Invalid OTP",
				Valid:   false,
			}, nil
		}
		return nil, err
	}

	if otp.IsExpired() {
		return &dto.OTPResponse{
			Message: "OTP has expired",
			Valid:   false,
		}, nil
	}

	if !otp.IsValid(req.Code) {
		return &dto.OTPResponse{
			Message: "Invalid OTP",
			Valid:   false,
		}, nil
	}

	// Mark OTP as used
	if err := s.otpRepo.MarkAsUsed(ctx, otp.ID); err != nil {
		return nil, err
	}

	return &dto.OTPResponse{
		Message: "OTP verified successfully",
		Valid:   true,
	}, nil
}

// MockEmailService implements EmailService for development
type MockEmailService struct{}

func NewMockEmailService() EmailService {
	return &MockEmailService{}
}

func (s *MockEmailService) SendOTP(ctx context.Context, email, code string, purpose domain.OTPPurpose) error {
	log.Printf("[MockEmail] Sending OTP %s to %s for %s", code, email, purpose)
	return nil
}
