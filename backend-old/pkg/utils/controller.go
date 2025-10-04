package utils

import (
	"github.com/gin-gonic/gin"
)

type AddRoutes func(ctx *gin.Engine)
type Controller struct {
	AddRoutes AddRoutes
}
