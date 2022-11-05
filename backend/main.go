package main

import (
	"active-burger/pkg/controllers/user"

	"github.com/gin-gonic/gin"
)

func main() {
	// Init context
	ctx := gin.Default()

	// Add routes
	user.UserController.AddRoutes(ctx)

	// Run server
	ctx.Run("localhost:8080")
}
