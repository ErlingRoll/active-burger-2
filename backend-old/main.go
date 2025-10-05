package main

import (
	"active-burger/pkg/controllers/user"
	"active-burger/pkg/services"
	"active-burger/pkg/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load env
	err := godotenv.Load(".env")
	if err != nil {
		panic("Error loading .env file")
	}

	// Init context
	ctx := gin.Default()

	// Init Services
	db := services.InitDB()

	// Add CORS
	ctx.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		AllowCredentials: true,
	}))

	// Add middleware
	ctx.Use(utils.UserMiddleware())

	// Add database to gin context
	ctx.Use(func(ctx *gin.Context) {
		ctx.Set("db", db)
		ctx.Next()
	})

	// Add routes
	user.Controller(db).AddRoutes(ctx)

	// Run server
	ctx.Run("localhost:8080")
}
