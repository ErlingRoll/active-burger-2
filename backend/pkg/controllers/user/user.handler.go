package user

import (
	"active-burger/pkg/services/user"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func handleRegister(ctx *gin.Context) {
	var params HandleRegisterRequestParams
	err := ctx.BindJSON(&params)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if strings.Trim(params.Username, " ") == "" || strings.Trim(params.Password, " ") == "" {
		ctx.String(400, "username or password is empty")
		return
	}

	db := ctx.MustGet("db").(*pg.DB)

	_, err = user.GetUserByUsername(db, params.Username)
	if err != nil && err != pg.ErrNoRows {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	if err != pg.ErrNoRows {
		ctx.String(400, "username already exists")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	_, err = user.RegisterUser(db, params.Username, string(hashedPassword))
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(201)
}

func handleLogin(ctx *gin.Context) {
	var params HandleLoginRequestParams
	err := ctx.BindJSON(&params)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := ctx.MustGet("db").(*pg.DB)

	user, err := user.GetUserByUsername(db, params.Username)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	response := HandleLoginResponse{
		ID:       user.ID,
		Username: user.Username,
	}

	// Create JWT token
	tokenLifetime, _ := strconv.Atoi(os.Getenv("JWT_LIFETIME"))
	tokenExpiration := time.Now().Add(time.Duration(tokenLifetime) * time.Hour).Unix()

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = tokenExpiration
	claims["user"] = response

	// Sign and stringify token
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.SetCookie("token", tokenString, int(tokenExpiration), "/", "", false, true)
	ctx.JSON(200, response)
}

func handleLogout(ctx *gin.Context) {
	ctx.SetCookie("token", "", 0, "/", "", false, true)
	ctx.Status(200)
}

func HandleGetUser(ctx *gin.Context) {
	ctx.String(200, "Hello World")
}

func HandleGetUserByID(ctx *gin.Context) {
	ctx.String(200, "Hello World")
}
