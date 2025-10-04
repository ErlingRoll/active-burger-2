package user

import "github.com/google/uuid"

type HandleRegisterRequestParams struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type HandleLoginRequestParams struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type HandleLoginResponse struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
}
