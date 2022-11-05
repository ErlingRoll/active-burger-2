package user

import "github.com/gin-gonic/gin"

func handleLogin(ctx *gin.Context) {
	ctx.String(200, "Hello World")
}

func HandleGetUser(ctx *gin.Context) {
	ctx.String(200, "Hello World")
}
