package repository

import (
	"context"
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/pkg/database"
	"github.com/jackc/pgx/v5"
)

type PaymentRepository interface {
	Create(ctx context.Context, payment *domain.Payment) error
	GetByReference(ctx context.Context, reference string) (*domain.Payment, error)
	Update(ctx context.Context, payment *domain.Payment) error
}

type paymentRepository struct {
	db *database.PostgresDB
}

func NewPaymentRepository(db *database.PostgresDB) PaymentRepository {
	return &paymentRepository{db: db}
}

func (r *paymentRepository) Create(ctx context.Context, payment *domain.Payment) error {
	query := `
		INSERT INTO payments (wallet_id, reference, amount, email, message, status)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		payment.WalletID,
		payment.Reference,
		payment.Amount,
		payment.Email,
		payment.Message,
		payment.Status,
	).Scan(&payment.ID, &payment.CreatedAt, &payment.UpdatedAt)

	return err
}

func (r *paymentRepository) GetByReference(ctx context.Context, reference string) (*domain.Payment, error) {
	query := `
		SELECT id, wallet_id, reference, amount, email, message, status, paystack_reference, verified_at, created_at, updated_at
		FROM payments
		WHERE reference = $1`

	payment := &domain.Payment{}
	err := r.db.Pool.QueryRow(ctx, query, reference).Scan(
		&payment.ID,
		&payment.WalletID,
		&payment.Reference,
		&payment.Amount,
		&payment.Email,
		&payment.Message,
		&payment.Status,
		&payment.PaystackReference,
		&payment.VerifiedAt,
		&payment.CreatedAt,
		&payment.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrPaymentNotFound
		}
		return nil, err
	}

	return payment, nil
}

func (r *paymentRepository) Update(ctx context.Context, payment *domain.Payment) error {
	query := `
		UPDATE payments
		SET status = $1, paystack_reference = $2, verified_at = $3, updated_at = NOW()
		WHERE id = $4
		RETURNING updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		payment.Status,
		payment.PaystackReference,
		payment.VerifiedAt,
		payment.ID,
	).Scan(&payment.UpdatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrPaymentNotFound
		}
		return err
	}

	return nil
}
