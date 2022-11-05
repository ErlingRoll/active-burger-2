package user

import (
	"active-burger/pkg/utils"

	"github.com/gin-gonic/gin"
)

var UserController = &utils.Controller{
	AddRoutes: func(ctx *gin.Engine) {
		routes := ctx.Group("")
		{
			routes.POST("/login", handleLogin)
		}
		userRoutes := ctx.Group("/user")
		{
			userRoutes.GET("/:id", HandleGetUser)
		}
	},
}
