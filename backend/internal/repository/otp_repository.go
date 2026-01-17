package repository

import (
	"context"
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/pkg/database"
	"github.com/jackc/pgx/v5"
)

type otpRepository struct {
	db *database.PostgresDB
}

func NewOTPRepository(db *database.PostgresDB) OTPRepository {
	return &otpRepository{db: db}
}

func (r *otpRepository) Create(ctx context.Context, otp *domain.OTP) error {
	query := `
		INSERT INTO otps (email, code, purpose, expires_at, used)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at`

	err := r.db.Pool.QueryRow(ctx, query,
		otp.Email,
		otp.Code,
		otp.Purpose,
		otp.ExpiresAt,
		otp.Used,
	).Scan(&otp.ID, &otp.CreatedAt)

	return err
}

func (r *otpRepository) GetLatestByEmailAndPurpose(ctx context.Context, email string, purpose domain.OTPPurpose) (*domain.OTP, error) {
	query := `
		SELECT id, email, code, purpose, expires_at, used, created_at
		FROM otps
		WHERE email = $1 AND purpose = $2 AND used = false
		ORDER BY created_at DESC
		LIMIT 1`

	otp := &domain.OTP{}
	err := r.db.Pool.QueryRow(ctx, query, email, purpose).Scan(
		&otp.ID,
		&otp.Email,
		&otp.Code,
		&otp.Purpose,
		&otp.ExpiresAt,
		&otp.Used,
		&otp.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrOTPNotFound
		}
		return nil, err
	}

	return otp, nil
}

func (r *otpRepository) MarkAsUsed(ctx context.Context, id string) error {
	query := `UPDATE otps SET used = true WHERE id = $1`

	result, err := r.db.Pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return domain.ErrOTPNotFound
	}

	return nil
}

func (r *otpRepository) DeleteExpired(ctx context.Context) error {
	query := `DELETE FROM otps WHERE expires_at < NOW()`

	_, err := r.db.Pool.Exec(ctx, query)
	return err
}
