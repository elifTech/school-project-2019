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
	user     = "max"
	password = "1"
	dbname   = "school"
)

var ErrNotFound = errors.New("record not found")

//type Storage *gorm.DB
var Storage *gorm.DB

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
		return nil, fmt.Errorf("can't ping the DB: %v \n", err)
	}

	Storage = db

	log.Printf("Successfully connected to the DB... \n")

	return db, nil
}
