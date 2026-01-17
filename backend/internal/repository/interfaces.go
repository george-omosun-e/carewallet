package repository

import (
	"context"
	"time"

	"github.com/carewallet/backend/internal/domain"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByID(ctx context.Context, id string) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	Update(ctx context.Context, user *domain.User) error
	Delete(ctx context.Context, id string) error
}

type WalletRepository interface {
	Create(ctx context.Context, wallet *domain.Wallet) error
	GetByID(ctx context.Context, id string) (*domain.Wallet, error)
	GetByShareableCode(ctx context.Context, code string) (*domain.Wallet, error)
	GetByUserID(ctx context.Context, userID string) ([]*domain.Wallet, error)
	Update(ctx context.Context, wallet *domain.Wallet) error
	Delete(ctx context.Context, id string) error
	UpdateBalance(ctx context.Context, id string, amount string) error
	ShareableCodeExists(ctx context.Context, code string) (bool, error)
}

type TransactionRepository interface {
	Create(ctx context.Context, transaction *domain.Transaction) error
	GetByID(ctx context.Context, id string) (*domain.Transaction, error)
	GetByWalletID(ctx context.Context, walletID string, page, pageSize int) ([]*domain.Transaction, int, error)
	Update(ctx context.Context, transaction *domain.Transaction) error
}

type PharmacyRepository interface {
	Create(ctx context.Context, pharmacy *domain.Pharmacy) error
	GetByID(ctx context.Context, id string) (*domain.Pharmacy, error)
	GetByShortCode(ctx context.Context, code string) (*domain.Pharmacy, error)
	GetAll(ctx context.Context) ([]*domain.Pharmacy, error)
	Update(ctx context.Context, pharmacy *domain.Pharmacy) error
}

type OTPRepository interface {
	Create(ctx context.Context, otp *domain.OTP) error
	GetLatestByEmailAndPurpose(ctx context.Context, email string, purpose domain.OTPPurpose) (*domain.OTP, error)
	MarkAsUsed(ctx context.Context, id string) error
	DeleteExpired(ctx context.Context) error
}

type TokenBlacklistRepository interface {
	Add(ctx context.Context, jti, userID string, expiresAt time.Time) error
	Exists(ctx context.Context, jti string) (bool, error)
	DeleteExpired(ctx context.Context) error
}
