package main

import (
	"fmt"
	//"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
	"school-project-2019/server/domain"
	"school-project-2019/server/domain/devices"

	"github.com/rs/cors"
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
		Carbon:           &devices.Carbon{},
		Wind:             &devices.Wind{},
		Temperature:      &devices.Temperature{},
		WaterQuality:     &devices.WaterQuality{},
		WaterConsumption: &devices.WaterConsumption{},
	}

	s := &domain.IoTService{DB: db, Devices: &d}
	//storage.Storage = db
	router := s.NewRouter()

	s.DB.AutoMigrate(devices.WaterConsumptionEvent{}, devices.WindEvent{}, devices.Carbon{}, devices.TemperatureEvent{}, devices.WaterQualityEvent{}, devices.Sensor{})
	// prepare device
	err = s.Devices.Temperature.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	err = s.Devices.Carbon.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	err = s.Devices.WaterConsumption.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	err = s.Devices.Wind.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	// init server
	err = s.Devices.WaterQuality.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating : %s %v \n", devices.WaterQualitySensor, err))
		return
	}

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
	})

	// init server
	log.Fatal(http.ListenAndServe(":8080", c.Handler(router)))
}
