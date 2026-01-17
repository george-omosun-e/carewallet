package service

import (
	"context"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/repository"
	"github.com/carewallet/backend/internal/utils"
	"github.com/shopspring/decimal"
)

type WalletService interface {
	Create(ctx context.Context, userID string, req dto.CreateWalletRequest) (*dto.WalletResponse, error)
	GetByID(ctx context.Context, userID, walletID string) (*dto.WalletResponse, error)
	GetByShareableCode(ctx context.Context, code string) (*dto.PublicWalletResponse, error)
	GetUserWallets(ctx context.Context, userID string) ([]dto.WalletResponse, error)
	Update(ctx context.Context, userID, walletID string, req dto.UpdateWalletRequest) (*dto.WalletResponse, error)
	Delete(ctx context.Context, userID, walletID string) error
}

type walletService struct {
	walletRepo repository.WalletRepository
}

func NewWalletService(walletRepo repository.WalletRepository) WalletService {
	return &walletService{walletRepo: walletRepo}
}

func (s *walletService) Create(ctx context.Context, userID string, req dto.CreateWalletRequest) (*dto.WalletResponse, error) {
	// Generate unique shareable code
	var shareableCode string
	for {
		code, err := utils.GenerateShareableCode()
		if err != nil {
			return nil, err
		}
		exists, err := s.walletRepo.ShareableCodeExists(ctx, code)
		if err != nil {
			return nil, err
		}
		if !exists {
			shareableCode = code
			break
		}
	}

	wallet := &domain.Wallet{
		CreatorID:     userID,
		BeneficiaryID: req.BeneficiaryID,
		WalletName:    req.WalletName,
		Description:   req.Description,
		PhotoURL:      req.PhotoURL,
		Balance:       decimal.Zero,
		FundingGoal:   decimal.NewFromFloat(req.FundingGoal),
		ShareableCode: shareableCode,
		Status:        domain.WalletStatusActive,
	}

	if err := s.walletRepo.Create(ctx, wallet); err != nil {
		return nil, err
	}

	return walletToResponse(wallet), nil
}

func (s *walletService) GetByID(ctx context.Context, userID, walletID string) (*dto.WalletResponse, error) {
	wallet, err := s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		return nil, err
	}

	if !wallet.CanBeAccessedBy(userID) {
		return nil, domain.ErrWalletAccessDenied
	}

	return walletToResponse(wallet), nil
}

func (s *walletService) GetByShareableCode(ctx context.Context, code string) (*dto.PublicWalletResponse, error) {
	wallet, err := s.walletRepo.GetByShareableCode(ctx, code)
	if err != nil {
		return nil, err
	}

	return &dto.PublicWalletResponse{
		ID:            wallet.ID,
		WalletName:    wallet.WalletName,
		Description:   wallet.Description,
		PhotoURL:      wallet.PhotoURL,
		Balance:       wallet.Balance.InexactFloat64(),
		FundingGoal:   wallet.FundingGoal.InexactFloat64(),
		ShareableCode: wallet.ShareableCode,
	}, nil
}

func (s *walletService) GetUserWallets(ctx context.Context, userID string) ([]dto.WalletResponse, error) {
	wallets, err := s.walletRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.WalletResponse, len(wallets))
	for i, wallet := range wallets {
		responses[i] = *walletToResponse(wallet)
	}

	return responses, nil
}

func (s *walletService) Update(ctx context.Context, userID, walletID string, req dto.UpdateWalletRequest) (*dto.WalletResponse, error) {
	wallet, err := s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		return nil, err
	}

	if !wallet.CanBeAccessedBy(userID) {
		return nil, domain.ErrWalletAccessDenied
	}

	if req.WalletName != nil {
		wallet.WalletName = *req.WalletName
	}
	if req.Description != nil {
		wallet.Description = *req.Description
	}
	if req.PhotoURL != nil {
		wallet.PhotoURL = *req.PhotoURL
	}
	if req.FundingGoal != nil {
		wallet.FundingGoal = decimal.NewFromFloat(*req.FundingGoal)
	}
	if req.Status != nil {
		wallet.Status = domain.WalletStatus(*req.Status)
	}

	if err := s.walletRepo.Update(ctx, wallet); err != nil {
		return nil, err
	}

	return walletToResponse(wallet), nil
}

func (s *walletService) Delete(ctx context.Context, userID, walletID string) error {
	wallet, err := s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		return err
	}

	if !wallet.CanBeAccessedBy(userID) {
		return domain.ErrWalletAccessDenied
	}

	if !wallet.CanBeDeleted() {
		return domain.ErrWalletHasBalance
	}

	return s.walletRepo.Delete(ctx, walletID)
}

func walletToResponse(wallet *domain.Wallet) *dto.WalletResponse {
	return &dto.WalletResponse{
		ID:            wallet.ID,
		CreatorID:     wallet.CreatorID,
		BeneficiaryID: wallet.BeneficiaryID,
		WalletName:    wallet.WalletName,
		Description:   wallet.Description,
		PhotoURL:      wallet.PhotoURL,
		Balance:       wallet.Balance.InexactFloat64(),
		FundingGoal:   wallet.FundingGoal.InexactFloat64(),
		ShareableCode: wallet.ShareableCode,
		Status:        string(wallet.Status),
		CreatedAt:     wallet.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:     wallet.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
