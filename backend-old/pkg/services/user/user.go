package user

import (
	"active-burger/pkg/models"

	"github.com/go-pg/pg/v10"
)

func RegisterUser(db *pg.DB, username string, password string) (*models.User, error) {
	conn := db.Conn()
	defer conn.Close()

	user := models.User{
		Username: username,
		Password: password,
	}

	_, err := conn.Model(&user).Insert()

	return &user, err
}

func GetUserByUsername(db *pg.DB, username string) (*models.User, error) {
	conn := db.Conn()
	defer conn.Close()

	user := models.User{}

	err := conn.Model(&user).Where("username = ?", username).Select()

	return &user, err
}
