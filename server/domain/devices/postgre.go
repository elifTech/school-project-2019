package devices

import (
	"errors"
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
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
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
		host, port, user, dbname, password))
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting to DB: %v", err))
		return nil, err
	}

	//db = db.Debug()

	err = db.DB().Ping()
	if err != nil {
		return nil, fmt.Errorf("can't ping the DB: %v \n", err)

	}

	Storage = db

	log.Printf("Successfully connected to the DB... \n")

	return db, nil
}
