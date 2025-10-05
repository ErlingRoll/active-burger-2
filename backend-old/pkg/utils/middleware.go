package utils

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type RequestUser struct {
	Token    *jwt.Token `json:"token"`
	RawToken string     `json:"rawToken"`
	ID       uuid.UUID  `json:"id"`
	Username string     `json:"username"`
}

func UserMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie("token")
		if err != nil {
			ctx.Next()
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || token == nil || !token.Valid {
			ctx.Next()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ctx.Next()
			return
		}

		userClaim := claims["user"].(map[string]interface{})
		userID, errUserID := uuid.Parse(userClaim["id"].(string))
		username, okUsername := userClaim["username"].(string)
		if errUserID != nil || !okUsername {
			ctx.Next()
			return
		}

		requestUser := RequestUser{
			Token:    token,
			RawToken: tokenString,
			ID:       userID,
			Username: username,
		}

		// Token and user must exist and be valid for them to be set
		ctx.Set("token", token)
		ctx.Set("user", requestUser)
		ctx.Next()
	}
}

func RequireToken() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		_, exists := ctx.Get("token")
		if !exists {
			ctx.AbortWithStatusJSON(401, gin.H{
				"error": "Unauthorized",
			})
		} else {
			ctx.Next()
		}
	}
}
