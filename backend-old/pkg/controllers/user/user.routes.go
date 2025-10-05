package user

import (
	"active-burger/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
)

type UserController struct {
	Controller *utils.Controller
}

func Controller(db *pg.DB) utils.Controller {
	return utils.Controller{
		AddRoutes: func(ctx *gin.Engine) {
			routes := ctx.Group("")
			{
				routes.POST("/register", handleRegister)
				routes.POST("/login", handleLogin)
				routes.POST("/logout", handleLogout)
			}
			userRoutes := ctx.Group("/user")
			{
				userRoutes.GET("", utils.RequireToken(), HandleGetUser)
				userRoutes.GET("/:id", utils.RequireToken(), HandleGetUserByID)
			}
		},
	}

}
