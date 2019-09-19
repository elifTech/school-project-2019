package main

import (
	"fmt"
	"school-project-2019/server/domain/devices"

	//"fmt"
	//"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
	"school-project-2019/server/domain"
	"school-project-2019/server/storage"
	//"school-project-2019/server/storage"
)

func main() {
	// init DB
	db, err := storage.Connect()
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting: %v \n", err))
		return
	}
	// we will close the DB connection when close the app process
	defer db.Close()

	s := &domain.IoTService{DB: db}
	router := s.NewRouter()

	s.DB.AutoMigrate(devices.TemperatureEvent{}, devices.Sensor{})
	// prepare device

	t := devices.Temperature{}
	err = t.CreateSensor(db)
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	// init server
	log.Fatal(http.ListenAndServe(":8080", router))
}
