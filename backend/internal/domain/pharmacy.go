package domain

import (
	"time"
)

type PharmacyStatus string

const (
	PharmacyStatusActive   PharmacyStatus = "active"
	PharmacyStatusInactive PharmacyStatus = "inactive"
)

type Pharmacy struct {
	ID                 string         `json:"id"`
	Name               string         `json:"name"`
	ShortCode          string         `json:"short_code"`
	RegistrationNumber string         `json:"registration_number"`
	Address            string         `json:"address,omitempty"`
	Phone              string         `json:"phone,omitempty"`
	Email              string         `json:"email,omitempty"`
	Status             PharmacyStatus `json:"status"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
}
