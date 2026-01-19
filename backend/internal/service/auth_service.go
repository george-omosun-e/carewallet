package service

import (
	"context"

	"github.com/carewallet/backend/internal/config"
	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/dto"
	"github.com/carewallet/backend/internal/repository"
	"github.com/carewallet/backend/internal/utils"
)

type AuthService interface {
	Signup(ctx context.Context, req dto.SignupRequest) (*dto.AuthResponse, error)
	Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error)
	Logout(ctx context.Context, jti, userID string, claims *utils.JWTClaims) error
	GetCurrentUser(ctx context.Context, userID string) (*dto.UserResponse, error)
	IsTokenBlacklisted(ctx context.Context, jti string) (bool, error)
}

type authService struct {
	userRepo           repository.UserRepository
	tokenBlacklistRepo repository.TokenBlacklistRepository
	jwtManager         *utils.JWTManager
	config             *config.Config
}

func NewAuthService(
	userRepo repository.UserRepository,
	tokenBlacklistRepo repository.TokenBlacklistRepository,
	jwtManager *utils.JWTManager,
	cfg *config.Config,
) AuthService {
	return &authService{
		userRepo:           userRepo,
		tokenBlacklistRepo: tokenBlacklistRepo,
		jwtManager:         jwtManager,
		config:             cfg,
	}
}

func (s *authService) Signup(ctx context.Context, req dto.SignupRequest) (*dto.AuthResponse, error) {
	// Check if user already exists
	_, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err == nil {
		return nil, domain.ErrUserAlreadyExists
	}
	if err != domain.ErrUserNotFound {
		return nil, err
	}

	// Hash password
	passwordHash, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &domain.User{
		Email:        req.Email,
		FullName:     req.FullName,
		Phone:        req.Phone,
		PasswordHash: passwordHash,
		Verified:     false,
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Generate JWT
	token, _, err := s.jwtManager.Generate(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User:  userToResponse(user),
	}, nil
}

func (s *authService) Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		if err == domain.ErrUserNotFound {
			return nil, domain.ErrInvalidCredentials
		}
		return nil, err
	}

	if !utils.CheckPassword(req.Password, user.PasswordHash) {
		return nil, domain.ErrInvalidCredentials
	}

	token, _, err := s.jwtManager.Generate(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User:  userToResponse(user),
	}, nil
}

func (s *authService) Logout(ctx context.Context, jti, userID string, claims *utils.JWTClaims) error {
	expiresAt := claims.ExpiresAt.Time
	return s.tokenBlacklistRepo.Add(ctx, jti, userID, expiresAt)
}

func (s *authService) GetCurrentUser(ctx context.Context, userID string) (*dto.UserResponse, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	resp := userToResponse(user)
	return &resp, nil
}

func (s *authService) IsTokenBlacklisted(ctx context.Context, jti string) (bool, error) {
	return s.tokenBlacklistRepo.Exists(ctx, jti)
}

func userToResponse(user *domain.User) dto.UserResponse {
	role := string(user.Role)
	if role == "" {
		role = "user"
	}
	return dto.UserResponse{
		ID:       user.ID,
		Email:    user.Email,
		FullName: user.FullName,
		Phone:    user.Phone,
		Verified: user.Verified,
		Role:     role,
	}
}
