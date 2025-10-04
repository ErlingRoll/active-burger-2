package models

import "github.com/google/uuid"

type User struct {
	tableName struct{}  `pg:"user"`
	ID        uuid.UUID `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"password"`
}
