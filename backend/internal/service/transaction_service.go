package service

import (
	"context"

	"github.com/carewallet/backend/internal/config"
	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/repository"
	"github.com/shopspring/decimal"
)

type TransactionService interface {
	Deposit(ctx context.Context, walletID string, req dto.DepositRequest) (*dto.TransactionResponse, error)
	Withdraw(ctx context.Context, userID string, req dto.WithdrawalRequest) (*dto.TransactionResponse, error)
	GetWalletTransactions(ctx context.Context, userID, walletID string, page, pageSize int) (*dto.TransactionListResponse, error)
}

type transactionService struct {
	transactionRepo repository.TransactionRepository
	walletRepo      repository.WalletRepository
	pharmacyRepo    repository.PharmacyRepository
	otpService      OTPService
	config          *config.Config
}

func NewTransactionService(
	transactionRepo repository.TransactionRepository,
	walletRepo repository.WalletRepository,
	pharmacyRepo repository.PharmacyRepository,
	otpService OTPService,
	cfg *config.Config,
) TransactionService {
	return &transactionService{
		transactionRepo: transactionRepo,
		walletRepo:      walletRepo,
		pharmacyRepo:    pharmacyRepo,
		otpService:      otpService,
		config:          cfg,
	}
}

func (s *transactionService) Deposit(ctx context.Context, walletID string, req dto.DepositRequest) (*dto.TransactionResponse, error) {
	// Verify wallet exists and is active
	wallet, err := s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		return nil, err
	}

	if wallet.Status != domain.WalletStatusActive {
		return nil, domain.ErrWalletNotFound
	}

	amount := decimal.NewFromFloat(req.Amount)
	if amount.LessThanOrEqual(decimal.Zero) {
		return nil, domain.ErrInvalidAmount
	}

	// Create transaction (no fee on deposits)
	transaction := &domain.Transaction{
		WalletID:           walletID,
		Type:               domain.TransactionTypeDeposit,
		Amount:             amount,
		Fee:                decimal.Zero,
		NetAmount:          amount,
		Status:             domain.TransactionStatusCompleted,
		ContributorEmail:   req.ContributorEmail,
		ContributorName:    req.ContributorName,
		ContributorMessage: req.ContributorMessage,
		PaystackReference:  req.PaystackReference,
	}

	if err := s.transactionRepo.Create(ctx, transaction); err != nil {
		return nil, err
	}

	// Update wallet balance
	if err := s.walletRepo.UpdateBalance(ctx, walletID, amount.String()); err != nil {
		return nil, err
	}

	return transactionToResponse(transaction), nil
}

func (s *transactionService) Withdraw(ctx context.Context, userID string, req dto.WithdrawalRequest) (*dto.TransactionResponse, error) {
	// Verify wallet exists and user has access
	wallet, err := s.walletRepo.GetByID(ctx, req.WalletID)
	if err != nil {
		return nil, err
	}

	if !wallet.CanBeAccessedBy(userID) {
		return nil, domain.ErrWalletAccessDenied
	}

	// Get user for OTP verification
	amount := decimal.NewFromFloat(req.Amount)
	if amount.LessThanOrEqual(decimal.Zero) {
		return nil, domain.ErrInvalidAmount
	}

	// Calculate fee
	feePercentage := decimal.NewFromFloat(s.config.PlatformFeePercentage)
	fee := amount.Mul(feePercentage).Round(2)
	netAmount := amount.Sub(fee)

	// Check balance
	if wallet.Balance.LessThan(amount) {
		return nil, domain.ErrInsufficientBalance
	}

	// Verify pharmacy
	pharmacy, err := s.pharmacyRepo.GetByID(ctx, req.PharmacyID)
	if err != nil {
		return nil, err
	}

	if pharmacy.Status != domain.PharmacyStatusActive {
		return nil, domain.ErrPharmacyInactive
	}

	// Create transaction
	pharmacyID := pharmacy.ID
	transaction := &domain.Transaction{
		WalletID:     req.WalletID,
		Type:         domain.TransactionTypeWithdrawal,
		Amount:       amount,
		Fee:          fee,
		NetAmount:    netAmount,
		Status:       domain.TransactionStatusCompleted,
		PharmacyID:   &pharmacyID,
		PharmacyName: pharmacy.Name,
	}

	if err := s.transactionRepo.Create(ctx, transaction); err != nil {
		return nil, err
	}

	// Update wallet balance (subtract amount)
	negativeAmount := amount.Neg()
	if err := s.walletRepo.UpdateBalance(ctx, req.WalletID, negativeAmount.String()); err != nil {
		return nil, err
	}

	return transactionToResponse(transaction), nil
}

func (s *transactionService) GetWalletTransactions(ctx context.Context, userID, walletID string, page, pageSize int) (*dto.TransactionListResponse, error) {
	// Verify wallet access
	wallet, err := s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		return nil, err
	}

	if !wallet.CanBeAccessedBy(userID) {
		return nil, domain.ErrWalletAccessDenied
	}

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	transactions, total, err := s.transactionRepo.GetByWalletID(ctx, walletID, page, pageSize)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionResponse, len(transactions))
	for i, tx := range transactions {
		responses[i] = *transactionToResponse(tx)
	}

	return &dto.TransactionListResponse{
		Transactions: responses,
		Total:        total,
		Page:         page,
		PageSize:     pageSize,
	}, nil
}

func transactionToResponse(tx *domain.Transaction) *dto.TransactionResponse {
	return &dto.TransactionResponse{
		ID:                 tx.ID,
		WalletID:           tx.WalletID,
		Type:               string(tx.Type),
		Amount:             tx.Amount.InexactFloat64(),
		Fee:                tx.Fee.InexactFloat64(),
		NetAmount:          tx.NetAmount.InexactFloat64(),
		Status:             string(tx.Status),
		ContributorEmail:   tx.ContributorEmail,
		ContributorName:    tx.ContributorName,
		ContributorMessage: tx.ContributorMessage,
		PharmacyID:         tx.PharmacyID,
		PharmacyName:       tx.PharmacyName,
		PaystackReference:  tx.PaystackReference,
		CreatedAt:          tx.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
