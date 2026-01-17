package repository

import (
	"context"
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/pkg/database"
	"github.com/jackc/pgx/v5"
	"github.com/shopspring/decimal"
)

type walletRepository struct {
	db *database.PostgresDB
}

func NewWalletRepository(db *database.PostgresDB) WalletRepository {
	return &walletRepository{db: db}
}

func (r *walletRepository) Create(ctx context.Context, wallet *domain.Wallet) error {
	query := `
		INSERT INTO wallets (creator_id, beneficiary_id, wallet_name, description, photo_url, balance, funding_goal, shareable_code, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		wallet.CreatorID,
		wallet.BeneficiaryID,
		wallet.WalletName,
		wallet.Description,
		wallet.PhotoURL,
		wallet.Balance,
		wallet.FundingGoal,
		wallet.ShareableCode,
		wallet.Status,
	).Scan(&wallet.ID, &wallet.CreatedAt, &wallet.UpdatedAt)

	return err
}

func (r *walletRepository) GetByID(ctx context.Context, id string) (*domain.Wallet, error) {
	query := `
		SELECT id, creator_id, beneficiary_id, wallet_name, description, photo_url, balance, funding_goal, shareable_code, status, created_at, updated_at
		FROM wallets
		WHERE id = $1`

	wallet := &domain.Wallet{}
	var balance, fundingGoal decimal.NullDecimal

	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&wallet.ID,
		&wallet.CreatorID,
		&wallet.BeneficiaryID,
		&wallet.WalletName,
		&wallet.Description,
		&wallet.PhotoURL,
		&balance,
		&fundingGoal,
		&wallet.ShareableCode,
		&wallet.Status,
		&wallet.CreatedAt,
		&wallet.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrWalletNotFound
		}
		return nil, err
	}

	if balance.Valid {
		wallet.Balance = balance.Decimal
	}
	if fundingGoal.Valid {
		wallet.FundingGoal = fundingGoal.Decimal
	}

	return wallet, nil
}

func (r *walletRepository) GetByShareableCode(ctx context.Context, code string) (*domain.Wallet, error) {
	query := `
		SELECT id, creator_id, beneficiary_id, wallet_name, description, photo_url, balance, funding_goal, shareable_code, status, created_at, updated_at
		FROM wallets
		WHERE shareable_code = $1 AND status = 'active'`

	wallet := &domain.Wallet{}
	var balance, fundingGoal decimal.NullDecimal

	err := r.db.Pool.QueryRow(ctx, query, code).Scan(
		&wallet.ID,
		&wallet.CreatorID,
		&wallet.BeneficiaryID,
		&wallet.WalletName,
		&wallet.Description,
		&wallet.PhotoURL,
		&balance,
		&fundingGoal,
		&wallet.ShareableCode,
		&wallet.Status,
		&wallet.CreatedAt,
		&wallet.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrWalletNotFound
		}
		return nil, err
	}

	if balance.Valid {
		wallet.Balance = balance.Decimal
	}
	if fundingGoal.Valid {
		wallet.FundingGoal = fundingGoal.Decimal
	}

	return wallet, nil
}

func (r *walletRepository) GetByUserID(ctx context.Context, userID string) ([]*domain.Wallet, error) {
	query := `
		SELECT id, creator_id, beneficiary_id, wallet_name, description, photo_url, balance, funding_goal, shareable_code, status, created_at, updated_at
		FROM wallets
		WHERE creator_id = $1 OR beneficiary_id = $1
		ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var wallets []*domain.Wallet
	for rows.Next() {
		wallet := &domain.Wallet{}
		var balance, fundingGoal decimal.NullDecimal

		err := rows.Scan(
			&wallet.ID,
			&wallet.CreatorID,
			&wallet.BeneficiaryID,
			&wallet.WalletName,
			&wallet.Description,
			&wallet.PhotoURL,
			&balance,
			&fundingGoal,
			&wallet.ShareableCode,
			&wallet.Status,
			&wallet.CreatedAt,
			&wallet.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if balance.Valid {
			wallet.Balance = balance.Decimal
		}
		if fundingGoal.Valid {
			wallet.FundingGoal = fundingGoal.Decimal
		}

		wallets = append(wallets, wallet)
	}

	return wallets, nil
}

func (r *walletRepository) Update(ctx context.Context, wallet *domain.Wallet) error {
	query := `
		UPDATE wallets
		SET wallet_name = $1, description = $2, photo_url = $3, funding_goal = $4, status = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		wallet.WalletName,
		wallet.Description,
		wallet.PhotoURL,
		wallet.FundingGoal,
		wallet.Status,
		wallet.ID,
	).Scan(&wallet.UpdatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrWalletNotFound
		}
		return err
	}

	return nil
}

func (r *walletRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM wallets WHERE id = $1`

	result, err := r.db.Pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return domain.ErrWalletNotFound
	}

	return nil
}

func (r *walletRepository) UpdateBalance(ctx context.Context, id string, amount string) error {
	query := `
		UPDATE wallets
		SET balance = balance + $1::decimal, updated_at = NOW()
		WHERE id = $2`

	result, err := r.db.Pool.Exec(ctx, query, amount, id)
	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return domain.ErrWalletNotFound
	}

	return nil
}

func (r *walletRepository) ShareableCodeExists(ctx context.Context, code string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM wallets WHERE shareable_code = $1)`

	var exists bool
	err := r.db.Pool.QueryRow(ctx, query, code).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}
