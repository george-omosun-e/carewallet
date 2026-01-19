package handler

import (
	"errors"
	"strconv"

	"github.com/carewallet/backend/internal/domain"
	"github.com/carewallet/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	adminService service.AdminService
}

func NewAdminHandler(adminService service.AdminService) *AdminHandler {
	return &AdminHandler{adminService: adminService}
}

func (h *AdminHandler) GetPharmacies(c *gin.Context) {
	filter := service.PharmacyFilter{
		Status: c.Query("status"),
		Search: c.Query("search"),
	}

	if page, err := strconv.Atoi(c.Query("page")); err == nil {
		filter.Page = page
	}
	if limit, err := strconv.Atoi(c.Query("limit")); err == nil {
		filter.Limit = limit
	}

	pharmacies, total, err := h.adminService.GetPharmacies(c.Request.Context(), filter)
	if err != nil {
		InternalError(c, "Failed to get pharmacies")
		return
	}

	Success(c, gin.H{
		"items": pharmacies,
		"total": total,
		"page":  filter.Page,
		"limit": filter.Limit,
	})
}

func (h *AdminHandler) GetPharmacy(c *gin.Context) {
	id := c.Param("id")

	pharmacy, err := h.adminService.GetPharmacy(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrPharmacyNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to get pharmacy")
		return
	}

	Success(c, pharmacy)
}

type CreatePharmacyRequest struct {
	Name               string `json:"name" binding:"required"`
	ShortCode          string `json:"short_code" binding:"required"`
	RegistrationNumber string `json:"registration_number" binding:"required"`
	Address            string `json:"address"`
	Phone              string `json:"phone"`
	Email              string `json:"email"`
	Password           string `json:"password" binding:"required,min=8"`
}

func (h *AdminHandler) CreatePharmacy(c *gin.Context) {
	var req CreatePharmacyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	pharmacy, err := h.adminService.CreatePharmacy(c.Request.Context(), service.CreatePharmacyRequest{
		Name:               req.Name,
		ShortCode:          req.ShortCode,
		RegistrationNumber: req.RegistrationNumber,
		Address:            req.Address,
		Phone:              req.Phone,
		Email:              req.Email,
		Password:           req.Password,
	})
	if err != nil {
		InternalError(c, "Failed to create pharmacy")
		return
	}

	Created(c, pharmacy)
}

func (h *AdminHandler) UpdatePharmacy(c *gin.Context) {
	id := c.Param("id")

	var req service.UpdatePharmacyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, err.Error())
		return
	}

	pharmacy, err := h.adminService.UpdatePharmacy(c.Request.Context(), id, req)
	if err != nil {
		if errors.Is(err, domain.ErrPharmacyNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to update pharmacy")
		return
	}

	Success(c, pharmacy)
}

func (h *AdminHandler) ApprovePharmacy(c *gin.Context) {
	id := c.Param("id")

	pharmacy, err := h.adminService.ApprovePharmacy(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrPharmacyNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to approve pharmacy")
		return
	}

	Success(c, pharmacy)
}

func (h *AdminHandler) SuspendPharmacy(c *gin.Context) {
	id := c.Param("id")

	pharmacy, err := h.adminService.SuspendPharmacy(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrPharmacyNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to suspend pharmacy")
		return
	}

	Success(c, pharmacy)
}

func (h *AdminHandler) ReactivatePharmacy(c *gin.Context) {
	id := c.Param("id")

	pharmacy, err := h.adminService.ReactivatePharmacy(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrPharmacyNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to reactivate pharmacy")
		return
	}

	Success(c, pharmacy)
}

func (h *AdminHandler) DeletePharmacy(c *gin.Context) {
	id := c.Param("id")

	err := h.adminService.DeletePharmacy(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrPharmacyNotFound) {
			NotFound(c, err.Error())
			return
		}
		InternalError(c, "Failed to delete pharmacy")
		return
	}

	Success(c, gin.H{"message": "Pharmacy deleted successfully"})
}

func (h *AdminHandler) GetDashboardStats(c *gin.Context) {
	stats, err := h.adminService.GetDashboardStats(c.Request.Context())
	if err != nil {
		InternalError(c, "Failed to get dashboard stats")
		return
	}

	Success(c, stats)
}
