package repository

import (
	"context"
	"time"

	"github.com/carewallet/backend/pkg/database"
)

type tokenBlacklistRepository struct {
	db *database.PostgresDB
}

func NewTokenBlacklistRepository(db *database.PostgresDB) TokenBlacklistRepository {
	return &tokenBlacklistRepository{db: db}
}

func (r *tokenBlacklistRepository) Add(ctx context.Context, jti, userID string, expiresAt time.Time) error {
	query := `
		INSERT INTO token_blacklist (token_jti, user_id, expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (token_jti) DO NOTHING`

	_, err := r.db.Pool.Exec(ctx, query, jti, userID, expiresAt)
	return err
}

func (r *tokenBlacklistRepository) Exists(ctx context.Context, jti string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM token_blacklist WHERE token_jti = $1)`

	var exists bool
	err := r.db.Pool.QueryRow(ctx, query, jti).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (r *tokenBlacklistRepository) DeleteExpired(ctx context.Context) error {
	query := `DELETE FROM token_blacklist WHERE expires_at < NOW()`

	_, err := r.db.Pool.Exec(ctx, query)
	return err
}
