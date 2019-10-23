package devices

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

// ErrNotFound ...
var ErrNotFound = errors.New("record not found")
// ErrBadStatus ...
var ErrBadStatus = errors.New("status is not correct")

// Storage type *gorm.DB
var Storage *gorm.DB

// Connect ...
func Connect() (*gorm.DB, error) {
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s",
		host, port, user, dbname, password))
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting to DB: %v", err))
		return nil, err
	}

	//db = db.Debug()

	err = db.DB().Ping()
	if err != nil {
		return nil, fmt.Errorf("Can't ping the DB: %v ", err)
	}

	Storage = db

	log.Printf("Successfully connected to the DB... \n")

	return db, nil
}
