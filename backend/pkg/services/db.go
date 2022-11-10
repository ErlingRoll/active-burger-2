package services

import (
	"fmt"

	"github.com/go-pg/pg/v10"
)

func InitDB() *pg.DB {
	db := pg.Connect(&pg.Options{
		Addr:     "localhost:5432",
		User:     "admin",
		Password: "olafunnyman",
		Database: "active_burger",
	})

	if db.Ping(db.Context()) != nil {
		panic("Failed to connect to database")
	} else {
		fmt.Printf("Connected to database!\n")
	}

	return db
}
