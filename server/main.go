package main

import (
	"fmt"
	//"school-project-2019/server/domain/devices"

	//"fmt"
	//"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/rs/cors"
	"log"
	"net/http"
	"school-project-2019/server/domain"
	"school-project-2019/server/domain/devices"
	//"school-project-2019/server/storage"
)

func main() {
	// init DB
	db, err := devices.Connect()
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting: %v \n", err))
		return
	}
	// we will close the DB connection when close the app process
	defer db.Close()

	// init your devices here
	d := domain.Devices{
		Carbon: &devices.Carbon{},
		Wind:        &devices.Wind{},
	}

	s := &domain.IoTService{DB: db, Devices: &d}
	//storage.Storage = db
	router := s.NewRouter()

	s.DB.AutoMigrate(devices.CarbonEvent{}, devices.Sensor{})
	// prepare device
	err = s.Devices.Carbon.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
	  })
	
	  // init server
	  log.Fatal(http.ListenAndServe(":8080", c.Handler(router)))
}
