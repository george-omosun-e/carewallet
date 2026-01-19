package repository

import (
	"context"
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/pkg/database"
	"github.com/jackc/pgx/v5"
)

type userRepository struct {
	db *database.PostgresDB
}

func NewUserRepository(db *database.PostgresDB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
	if user.Role == "" {
		user.Role = domain.UserRoleUser
	}
	query := `
		INSERT INTO users (email, full_name, phone, password_hash, verified, role)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		user.Email,
		user.FullName,
		user.Phone,
		user.PasswordHash,
		user.Verified,
		user.Role,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if isUniqueViolation(err) {
			return domain.ErrUserAlreadyExists
		}
		return err
	}

	return nil
}

func (r *userRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	query := `
		SELECT id, email, full_name, phone, password_hash, verified, COALESCE(role, 'user'), created_at, updated_at
		FROM users
		WHERE id = $1`

	user := &domain.User{}
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.FullName,
		&user.Phone,
		&user.PasswordHash,
		&user.Verified,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, err
	}

	return user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `
		SELECT id, email, full_name, phone, password_hash, verified, COALESCE(role, 'user'), created_at, updated_at
		FROM users
		WHERE email = $1`

	user := &domain.User{}
	err := r.db.Pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.FullName,
		&user.Phone,
		&user.PasswordHash,
		&user.Verified,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, err
	}

	return user, nil
}

func (r *userRepository) Update(ctx context.Context, user *domain.User) error {
	query := `
		UPDATE users
		SET full_name = $1, phone = $2, verified = $3, updated_at = NOW()
		WHERE id = $4
		RETURNING updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		user.FullName,
		user.Phone,
		user.Verified,
		user.ID,
	).Scan(&user.UpdatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrUserNotFound
		}
		return err
	}

	return nil
}

func (r *userRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM users WHERE id = $1`

	result, err := r.db.Pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return domain.ErrUserNotFound
	}

	return nil
}

func isUniqueViolation(err error) bool {
	return err != nil && (errors.Is(err, pgx.ErrNoRows) == false) &&
		(err.Error() == "ERROR: duplicate key value violates unique constraint" ||
			containsString(err.Error(), "duplicate key") ||
			containsString(err.Error(), "unique constraint"))
}

func containsString(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsSubstring(s, substr))
}

func containsSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
