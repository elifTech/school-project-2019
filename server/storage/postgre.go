package storage

import (
	"errors"
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
)

const (
	host     = "localhost"
	port     = "5432"
	user     = "school"
	password = "eliftech"
	dbname   = "school"
)

var NOT_FOUND = errors.New("record not found")

func Connect() (*gorm.DB, error) {
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s",
		host, port, user, dbname, password))
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting to DB: %v", err))
		return nil, err
	}

	log.Printf("Successfully connected to the DB... \n")

	return db, nil
}
