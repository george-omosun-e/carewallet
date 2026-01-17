package repository

import (
	"context"
	"errors"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/pkg/database"
	"github.com/jackc/pgx/v5"
)

type pharmacyRepository struct {
	db *database.PostgresDB
}

func NewPharmacyRepository(db *database.PostgresDB) PharmacyRepository {
	return &pharmacyRepository{db: db}
}

func (r *pharmacyRepository) Create(ctx context.Context, pharmacy *domain.Pharmacy) error {
	query := `
		INSERT INTO pharmacies (name, short_code, registration_number, address, phone, email, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		pharmacy.Name,
		pharmacy.ShortCode,
		pharmacy.RegistrationNumber,
		pharmacy.Address,
		pharmacy.Phone,
		pharmacy.Email,
		pharmacy.Status,
	).Scan(&pharmacy.ID, &pharmacy.CreatedAt, &pharmacy.UpdatedAt)

	return err
}

func (r *pharmacyRepository) GetByID(ctx context.Context, id string) (*domain.Pharmacy, error) {
	query := `
		SELECT id, name, short_code, registration_number, address, phone, email, status, created_at, updated_at
		FROM pharmacies
		WHERE id = $1`

	pharmacy := &domain.Pharmacy{}
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&pharmacy.ID,
		&pharmacy.Name,
		&pharmacy.ShortCode,
		&pharmacy.RegistrationNumber,
		&pharmacy.Address,
		&pharmacy.Phone,
		&pharmacy.Email,
		&pharmacy.Status,
		&pharmacy.CreatedAt,
		&pharmacy.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrPharmacyNotFound
		}
		return nil, err
	}

	return pharmacy, nil
}

func (r *pharmacyRepository) GetByShortCode(ctx context.Context, code string) (*domain.Pharmacy, error) {
	query := `
		SELECT id, name, short_code, registration_number, address, phone, email, status, created_at, updated_at
		FROM pharmacies
		WHERE short_code = $1`

	pharmacy := &domain.Pharmacy{}
	err := r.db.Pool.QueryRow(ctx, query, code).Scan(
		&pharmacy.ID,
		&pharmacy.Name,
		&pharmacy.ShortCode,
		&pharmacy.RegistrationNumber,
		&pharmacy.Address,
		&pharmacy.Phone,
		&pharmacy.Email,
		&pharmacy.Status,
		&pharmacy.CreatedAt,
		&pharmacy.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrPharmacyNotFound
		}
		return nil, err
	}

	return pharmacy, nil
}

func (r *pharmacyRepository) GetAll(ctx context.Context) ([]*domain.Pharmacy, error) {
	query := `
		SELECT id, name, short_code, registration_number, address, phone, email, status, created_at, updated_at
		FROM pharmacies
		WHERE status = 'active'
		ORDER BY name`

	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var pharmacies []*domain.Pharmacy
	for rows.Next() {
		pharmacy := &domain.Pharmacy{}
		err := rows.Scan(
			&pharmacy.ID,
			&pharmacy.Name,
			&pharmacy.ShortCode,
			&pharmacy.RegistrationNumber,
			&pharmacy.Address,
			&pharmacy.Phone,
			&pharmacy.Email,
			&pharmacy.Status,
			&pharmacy.CreatedAt,
			&pharmacy.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		pharmacies = append(pharmacies, pharmacy)
	}

	return pharmacies, nil
}

func (r *pharmacyRepository) Update(ctx context.Context, pharmacy *domain.Pharmacy) error {
	query := `
		UPDATE pharmacies
		SET name = $1, short_code = $2, registration_number = $3, address = $4, phone = $5, email = $6, status = $7, updated_at = NOW()
		WHERE id = $8
		RETURNING updated_at`

	err := r.db.Pool.QueryRow(ctx, query,
		pharmacy.Name,
		pharmacy.ShortCode,
		pharmacy.RegistrationNumber,
		pharmacy.Address,
		pharmacy.Phone,
		pharmacy.Email,
		pharmacy.Status,
		pharmacy.ID,
	).Scan(&pharmacy.UpdatedAt)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ErrPharmacyNotFound
		}
		return err
	}

	return nil
}
