package repository

import (
	"context"
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/pkg/database"
	"github.com/jackc/pgx/v5"
	"github.com/shopspring/decimal"
)

type transactionRepository struct {
	db *database.PostgresDB
}

func NewTransactionRepository(db *database.PostgresDB) TransactionRepository {
	return &transactionRepository{db: db}
}

func (r *transactionRepository) Create(ctx context.Context, tx *domain.Transaction) error {
	query := `
		INSERT INTO transactions (wallet_id, type, amount, fee, net_amount, status, contributor_email, contributor_name, contributor_message, pharmacy_id, pharmacy_name, paystack_reference)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, created_at, updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		tx.WalletID,
		tx.Type,
		tx.Amount,
		tx.Fee,
		tx.NetAmount,
		tx.Status,
		tx.ContributorEmail,
		tx.ContributorName,
		tx.ContributorMessage,
		tx.PharmacyID,
		tx.PharmacyName,
		tx.PaystackReference,
	).Scan(&tx.ID, &tx.CreatedAt, &tx.UpdatedAt)

	return err
}

func (r *transactionRepository) GetByID(ctx context.Context, id string) (*domain.Transaction, error) {
	query := `
		SELECT id, wallet_id, type, amount, fee, net_amount, status, contributor_email, contributor_name, contributor_message, pharmacy_id, pharmacy_name, paystack_reference, created_at, updated_at
		FROM transactions
		WHERE id = $1`

	tx := &domain.Transaction{}
	var amount, fee, netAmount decimal.Decimal

	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&tx.ID,
		&tx.WalletID,
		&tx.Type,
		&amount,
		&fee,
		&netAmount,
		&tx.Status,
		&tx.ContributorEmail,
		&tx.ContributorName,
		&tx.ContributorMessage,
		&tx.PharmacyID,
		&tx.PharmacyName,
		&tx.PaystackReference,
		&tx.CreatedAt,
		&tx.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrTransactionNotFound
		}
		return nil, err
	}

	tx.Amount = amount
	tx.Fee = fee
	tx.NetAmount = netAmount

	return tx, nil
}

func (r *transactionRepository) GetByWalletID(ctx context.Context, walletID string, page, pageSize int) ([]*domain.Transaction, int, error) {
	countQuery := `SELECT COUNT(*) FROM transactions WHERE wallet_id = $1`

	var total int
	err := r.db.Pool.QueryRow(ctx, countQuery, walletID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	query := `
		SELECT id, wallet_id, type, amount, fee, net_amount, status, contributor_email, contributor_name, contributor_message, pharmacy_id, pharmacy_name, paystack_reference, created_at, updated_at
		FROM transactions
		WHERE wallet_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := r.db.Pool.Query(ctx, query, walletID, pageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var transactions []*domain.Transaction
	for rows.Next() {
		tx := &domain.Transaction{}
		var amount, fee, netAmount decimal.Decimal

		err := rows.Scan(
			&tx.ID,
			&tx.WalletID,
			&tx.Type,
			&amount,
			&fee,
			&netAmount,
			&tx.Status,
			&tx.ContributorEmail,
			&tx.ContributorName,
			&tx.ContributorMessage,
			&tx.PharmacyID,
			&tx.PharmacyName,
			&tx.PaystackReference,
			&tx.CreatedAt,
			&tx.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}

		tx.Amount = amount
		tx.Fee = fee
		tx.NetAmount = netAmount

		transactions = append(transactions, tx)
	}

	return transactions, total, nil
}

func (r *transactionRepository) Update(ctx context.Context, tx *domain.Transaction) error {
	query := `
		UPDATE transactions
		SET status = $1, updated_at = NOW()
		WHERE id = $2
		RETURNING updated_at`

	err := r.db.Pool.QueryRow(ctx, query, tx.Status, tx.ID).Scan(&tx.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrTransactionNotFound
		}
		return err
	}

	return nil
}
