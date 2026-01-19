package paystack

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	baseURL = "https://api.paystack.co"
)

type Client struct {
	secretKey  string
	httpClient *http.Client
}

func NewClient(secretKey string) *Client {
	return &Client{
		secretKey: secretKey,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

type InitializeRequest struct {
	Email     string            `json:"email"`
	Amount    int64             `json:"amount"` // Amount in smallest currency unit (kobo for NGN, cents for ZAR)
	Currency  string            `json:"currency"`
	Reference string            `json:"reference"`
	Metadata  map[string]string `json:"metadata,omitempty"`
}

type InitializeResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		AuthorizationURL string `json:"authorization_url"`
		AccessCode       string `json:"access_code"`
		Reference        string `json:"reference"`
	} `json:"data"`
}

type VerifyResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		ID              int64  `json:"id"`
		Domain          string `json:"domain"`
		Status          string `json:"status"`
		Reference       string `json:"reference"`
		Amount          int64  `json:"amount"`
		GatewayResponse string `json:"gateway_response"`
		PaidAt          string `json:"paid_at"`
		Channel         string `json:"channel"`
		Currency        string `json:"currency"`
		IPAddress       string `json:"ip_address"`
		Metadata        struct {
			WalletID string `json:"wallet_id"`
			Message  string `json:"message"`
		} `json:"metadata"`
		Customer struct {
			Email string `json:"email"`
		} `json:"customer"`
	} `json:"data"`
}

func (c *Client) doRequest(method, endpoint string, body interface{}) ([]byte, error) {
	var reqBody io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewBuffer(jsonData)
	}

	req, err := http.NewRequest(method, baseURL+endpoint, reqBody)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+c.secretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("paystack API error: %s", string(respBody))
	}

	return respBody, nil
}

func (c *Client) InitializeTransaction(req *InitializeRequest) (*InitializeResponse, error) {
	respBody, err := c.doRequest("POST", "/transaction/initialize", req)
	if err != nil {
		return nil, err
	}

	var response InitializeResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, err
	}

	if !response.Status {
		return nil, fmt.Errorf("paystack error: %s", response.Message)
	}

	return &response, nil
}

func (c *Client) VerifyTransaction(reference string) (*VerifyResponse, error) {
	respBody, err := c.doRequest("GET", "/transaction/verify/"+reference, nil)
	if err != nil {
		return nil, err
	}

	var response VerifyResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, err
	}

	return &response, nil
}
