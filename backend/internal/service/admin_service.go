package service

import (
	"context"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/repository"
	"github.com/carewallet/backend/internal/utils"
)

type AdminService interface {
	GetPharmacies(ctx context.Context, filter PharmacyFilter) ([]*domain.Pharmacy, int, error)
	GetPharmacy(ctx context.Context, id string) (*domain.Pharmacy, error)
	CreatePharmacy(ctx context.Context, req CreatePharmacyRequest) (*domain.Pharmacy, error)
	UpdatePharmacy(ctx context.Context, id string, req UpdatePharmacyRequest) (*domain.Pharmacy, error)
	ApprovePharmacy(ctx context.Context, id string) (*domain.Pharmacy, error)
	SuspendPharmacy(ctx context.Context, id string) (*domain.Pharmacy, error)
	ReactivatePharmacy(ctx context.Context, id string) (*domain.Pharmacy, error)
	DeletePharmacy(ctx context.Context, id string) error
	GetDashboardStats(ctx context.Context) (*DashboardStats, error)
}

type PharmacyFilter struct {
	Status string
	Search string
	Page   int
	Limit  int
}

type CreatePharmacyRequest struct {
	Name               string `json:"name"`
	ShortCode          string `json:"short_code"`
	RegistrationNumber string `json:"registration_number"`
	Address            string `json:"address"`
	Phone              string `json:"phone"`
	Email              string `json:"email"`
	Password           string `json:"password"`
}

type UpdatePharmacyRequest struct {
	Name               string `json:"name"`
	ShortCode          string `json:"short_code"`
	RegistrationNumber string `json:"registration_number"`
	Address            string `json:"address"`
	Phone              string `json:"phone"`
	Email              string `json:"email"`
	Password           string `json:"password,omitempty"`
}

type DashboardStats struct {
	TotalPharmacies   int     `json:"total_pharmacies"`
	ActivePharmacies  int     `json:"active_pharmacies"`
	PendingPharmacies int     `json:"pending_pharmacies"`
	TotalTransactions int     `json:"total_transactions"`
	TotalWithdrawals  float64 `json:"total_withdrawals"`
}

type adminService struct {
	pharmacyRepo    repository.PharmacyRepository
	transactionRepo repository.TransactionRepository
}

func NewAdminService(pharmacyRepo repository.PharmacyRepository, transactionRepo repository.TransactionRepository) AdminService {
	return &adminService{
		pharmacyRepo:    pharmacyRepo,
		transactionRepo: transactionRepo,
	}
}

func (s *adminService) GetPharmacies(ctx context.Context, filter PharmacyFilter) ([]*domain.Pharmacy, int, error) {
	pharmacies, err := s.pharmacyRepo.GetAll(ctx)
	if err != nil {
		return nil, 0, err
	}

	// Filter by status if specified
	if filter.Status != "" {
		filtered := make([]*domain.Pharmacy, 0)
		for _, p := range pharmacies {
			if string(p.Status) == filter.Status {
				filtered = append(filtered, p)
			}
		}
		pharmacies = filtered
	}

	return pharmacies, len(pharmacies), nil
}

func (s *adminService) GetPharmacy(ctx context.Context, id string) (*domain.Pharmacy, error) {
	return s.pharmacyRepo.GetByID(ctx, id)
}

func (s *adminService) CreatePharmacy(ctx context.Context, req CreatePharmacyRequest) (*domain.Pharmacy, error) {
	// Hash password
	passwordHash, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	pharmacy := &domain.Pharmacy{
		Name:               req.Name,
		ShortCode:          req.ShortCode,
		RegistrationNumber: req.RegistrationNumber,
		Address:            req.Address,
		Phone:              req.Phone,
		Email:              req.Email,
		PasswordHash:       passwordHash,
		Status:             domain.PharmacyStatusActive,
	}

	if err := s.pharmacyRepo.Create(ctx, pharmacy); err != nil {
		return nil, err
	}

	return pharmacy, nil
}

func (s *adminService) UpdatePharmacy(ctx context.Context, id string, req UpdatePharmacyRequest) (*domain.Pharmacy, error) {
	pharmacy, err := s.pharmacyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		pharmacy.Name = req.Name
	}
	if req.ShortCode != "" {
		pharmacy.ShortCode = req.ShortCode
	}
	if req.RegistrationNumber != "" {
		pharmacy.RegistrationNumber = req.RegistrationNumber
	}
	if req.Address != "" {
		pharmacy.Address = req.Address
	}
	if req.Phone != "" {
		pharmacy.Phone = req.Phone
	}
	if req.Email != "" {
		pharmacy.Email = req.Email
	}
	if req.Password != "" {
		passwordHash, err := utils.HashPassword(req.Password)
		if err != nil {
			return nil, err
		}
		pharmacy.PasswordHash = passwordHash
	}

	if err := s.pharmacyRepo.Update(ctx, pharmacy); err != nil {
		return nil, err
	}

	return pharmacy, nil
}

func (s *adminService) ApprovePharmacy(ctx context.Context, id string) (*domain.Pharmacy, error) {
	pharmacy, err := s.pharmacyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	pharmacy.Status = domain.PharmacyStatusActive
	if err := s.pharmacyRepo.Update(ctx, pharmacy); err != nil {
		return nil, err
	}

	return pharmacy, nil
}

func (s *adminService) SuspendPharmacy(ctx context.Context, id string) (*domain.Pharmacy, error) {
	pharmacy, err := s.pharmacyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	pharmacy.Status = domain.PharmacyStatusInactive
	if err := s.pharmacyRepo.Update(ctx, pharmacy); err != nil {
		return nil, err
	}

	return pharmacy, nil
}

func (s *adminService) ReactivatePharmacy(ctx context.Context, id string) (*domain.Pharmacy, error) {
	pharmacy, err := s.pharmacyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	pharmacy.Status = domain.PharmacyStatusActive
	if err := s.pharmacyRepo.Update(ctx, pharmacy); err != nil {
		return nil, err
	}

	return pharmacy, nil
}

func (s *adminService) DeletePharmacy(ctx context.Context, id string) error {
	// For now, we just suspend it instead of hard delete
	_, err := s.SuspendPharmacy(ctx, id)
	return err
}

func (s *adminService) GetDashboardStats(ctx context.Context) (*DashboardStats, error) {
	pharmacies, err := s.pharmacyRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	stats := &DashboardStats{
		TotalPharmacies: len(pharmacies),
	}

	for _, p := range pharmacies {
		switch p.Status {
		case domain.PharmacyStatusActive:
			stats.ActivePharmacies++
		case domain.PharmacyStatusInactive:
			// Pending count - in production this would be a separate status
		}
	}

	return stats, nil
}
