package service

import (
	"context"
	"fmt"
	"time"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/paystack"
	"github.com/carewallet/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type PaymentService interface {
	InitializePayment(ctx context.Context, walletID, email string, amount float64, message string) (*PaymentInitResult, error)
	VerifyPayment(ctx context.Context, reference string) (*PaymentVerifyResult, error)
}

type PaymentInitResult struct {
	Reference        string `json:"reference"`
	AccessCode       string `json:"access_code"`
	AuthorizationURL string `json:"authorization_url"`
}

type PaymentVerifyResult struct {
	Status        string  `json:"status"`
	Amount        float64 `json:"amount"`
	TransactionID string  `json:"transaction_id"`
}

type paymentService struct {
	paymentRepo     repository.PaymentRepository
	walletRepo      repository.WalletRepository
	transactionRepo repository.TransactionRepository
	paystackClient  *paystack.Client
}

func NewPaymentService(
	paymentRepo repository.PaymentRepository,
	walletRepo repository.WalletRepository,
	transactionRepo repository.TransactionRepository,
	paystackSecretKey string,
) PaymentService {
	return &paymentService{
		paymentRepo:     paymentRepo,
		walletRepo:      walletRepo,
		transactionRepo: transactionRepo,
		paystackClient:  paystack.NewClient(paystackSecretKey),
	}
}

func (s *paymentService) InitializePayment(ctx context.Context, walletID, email string, amount float64, message string) (*PaymentInitResult, error) {
	// Verify wallet exists
	wallet, err := s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		return nil, err
	}

	if wallet.Status != domain.WalletStatusActive {
		return nil, domain.ErrWalletAccessDenied
	}

	// Generate unique reference
	reference := fmt.Sprintf("CW_%s_%d", uuid.New().String()[:8], time.Now().Unix())

	// Convert amount to decimal
	amountDecimal := decimal.NewFromFloat(amount)

	// Create payment record
	payment := &domain.Payment{
		WalletID:  walletID,
		Reference: reference,
		Amount:    amountDecimal,
		Email:     email,
		Message:   message,
		Status:    domain.PaymentStatusPending,
	}

	if err := s.paymentRepo.Create(ctx, payment); err != nil {
		return nil, err
	}

	// Initialize with Paystack
	amountInCents := int64(amount * 100)
	paystackReq := &paystack.InitializeRequest{
		Email:     email,
		Amount:    amountInCents,
		Currency:  "ZAR",
		Reference: reference,
		Metadata: map[string]string{
			"wallet_id": walletID,
			"message":   message,
		},
	}

	resp, err := s.paystackClient.InitializeTransaction(paystackReq)
	if err != nil {
		return nil, err
	}

	return &PaymentInitResult{
		Reference:        reference,
		AccessCode:       resp.Data.AccessCode,
		AuthorizationURL: resp.Data.AuthorizationURL,
	}, nil
}

func (s *paymentService) VerifyPayment(ctx context.Context, reference string) (*PaymentVerifyResult, error) {
	// Get payment record
	payment, err := s.paymentRepo.GetByReference(ctx, reference)
	if err != nil {
		return nil, err
	}

	if payment.Status == domain.PaymentStatusCompleted {
		return nil, domain.ErrPaymentAlreadyVerified
	}

	// Verify with Paystack
	resp, err := s.paystackClient.VerifyTransaction(reference)
	if err != nil {
		return nil, err
	}

	amountFloat, _ := payment.Amount.Float64()

	if resp.Data.Status != "success" {
		payment.Status = domain.PaymentStatusFailed
		s.paymentRepo.Update(ctx, payment)
		return &PaymentVerifyResult{
			Status: "failed",
			Amount: amountFloat,
		}, domain.ErrPaymentFailed
	}

	// Update payment status
	now := time.Now()
	payment.Status = domain.PaymentStatusCompleted
	payment.PaystackReference = fmt.Sprintf("%d", resp.Data.ID)
	payment.VerifiedAt = &now

	if err := s.paymentRepo.Update(ctx, payment); err != nil {
		return nil, err
	}

	// Create deposit transaction
	transaction := &domain.Transaction{
		WalletID:           payment.WalletID,
		Type:               domain.TransactionTypeDeposit,
		Amount:             payment.Amount,
		Status:             domain.TransactionStatusCompleted,
		ContributorEmail:   payment.Email,
		ContributorMessage: payment.Message,
	}

	if err := s.transactionRepo.Create(ctx, transaction); err != nil {
		return nil, err
	}

	// Update wallet balance
	wallet, err := s.walletRepo.GetByID(ctx, payment.WalletID)
	if err != nil {
		return nil, err
	}

	wallet.Balance = wallet.Balance.Add(payment.Amount)
	if err := s.walletRepo.Update(ctx, wallet); err != nil {
		return nil, err
	}

	return &PaymentVerifyResult{
		Status:        "success",
		Amount:        amountFloat,
		TransactionID: transaction.ID,
	}, nil
}
