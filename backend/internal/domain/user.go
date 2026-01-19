package domain

import (
	"time"
)

type UserRole string

const (
	UserRoleUser     UserRole = "user"
	UserRolePharmacy UserRole = "pharmacy"
	UserRoleAdmin    UserRole = "admin"
)

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	FullName     string    `json:"full_name"`
	Phone        string    `json:"phone,omitempty"`
	PasswordHash string    `json:"-"`
	Verified     bool      `json:"verified"`
	Role         UserRole  `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
