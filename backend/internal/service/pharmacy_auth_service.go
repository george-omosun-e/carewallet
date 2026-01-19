package service

import (
	"context"

	"github.com/carewallet/backend/internal/config"
	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/repository"
	"github.com/carewallet/backend/internal/utils"
)

type PharmacyAuthService interface {
	Login(ctx context.Context, shortCode, password string) (*dto.PharmacyAuthResponse, error)
	GetCurrentPharmacy(ctx context.Context, pharmacyID string) (*domain.Pharmacy, error)
}

type pharmacyAuthService struct {
	pharmacyRepo repository.PharmacyRepository
	jwtManager   *utils.JWTManager
	config       *config.Config
}

func NewPharmacyAuthService(
	pharmacyRepo repository.PharmacyRepository,
	jwtManager *utils.JWTManager,
	cfg *config.Config,
) PharmacyAuthService {
	return &pharmacyAuthService{
		pharmacyRepo: pharmacyRepo,
		jwtManager:   jwtManager,
		config:       cfg,
	}
}

func (s *pharmacyAuthService) Login(ctx context.Context, shortCode, password string) (*dto.PharmacyAuthResponse, error) {
	pharmacy, err := s.pharmacyRepo.GetByShortCode(ctx, shortCode)
	if err != nil {
		if err == domain.ErrPharmacyNotFound {
			return nil, domain.ErrInvalidCredentials
		}
		return nil, err
	}

	if pharmacy.Status != domain.PharmacyStatusActive {
		return nil, domain.ErrPharmacyInactive
	}

	if !utils.CheckPassword(password, pharmacy.PasswordHash) {
		return nil, domain.ErrInvalidCredentials
	}

	// Generate JWT with pharmacy ID
	token, _, err := s.jwtManager.Generate(pharmacy.ID, pharmacy.Email)
	if err != nil {
		return nil, err
	}

	return &dto.PharmacyAuthResponse{
		Token:    token,
		Pharmacy: pharmacyToResponse(pharmacy),
	}, nil
}

func (s *pharmacyAuthService) GetCurrentPharmacy(ctx context.Context, pharmacyID string) (*domain.Pharmacy, error) {
	return s.pharmacyRepo.GetByID(ctx, pharmacyID)
}

func pharmacyToResponse(p *domain.Pharmacy) dto.PharmacyResponse {
	return dto.PharmacyResponse{
		ID:                 p.ID,
		Name:               p.Name,
		ShortCode:          p.ShortCode,
		RegistrationNumber: p.RegistrationNumber,
		Address:            p.Address,
		Phone:              p.Phone,
		Email:              p.Email,
		Status:             string(p.Status),
	}
}
