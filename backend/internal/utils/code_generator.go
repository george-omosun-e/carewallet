package utils

import (
	"crypto/rand"
	"math/big"
)

const (
	shareableCodeLength = 8
	shareableCodeChars  = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Excluded I, O, 0, 1 for clarity

	otpCodeLength = 6
	otpCodeChars  = "0123456789"
)

func GenerateShareableCode() (string, error) {
	return generateRandomString(shareableCodeLength, shareableCodeChars)
}

func GenerateOTPCode() (string, error) {
	return generateRandomString(otpCodeLength, otpCodeChars)
}

func generateRandomString(length int, charset string) (string, error) {
	result := make([]byte, length)
	charsetLen := big.NewInt(int64(len(charset)))

	for i := 0; i < length; i++ {
		num, err := rand.Int(rand.Reader, charsetLen)
		if err != nil {
			return "", err
		}
		result[i] = charset[num.Int64()]
	}

	return string(result), nil
}
