package main

import (
	"fmt"
	//"school-project-2019/server/domain/devices"

	//"fmt"
	//"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
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
		Temperature:  &devices.Temperature{},
		WaterQuality: &devices.WaterQuality{},
	}

	s := &domain.IoTService{DB: db, Devices: &d}
	//storage.Storage = db
	router := s.NewRouter()

	s.DB.AutoMigrate(devices.TemperatureEvent{}, devices.Sensor{})
	s.DB.AutoMigrate(devices.WaterQualityEvent{})
	// prepare device
	err = s.Devices.Temperature.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}
	err = s.Devices.WaterQuality.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating : %s %v \n", devices.WaterQualitySensor, err))
		return
	}

	// init server
	log.Fatal(http.ListenAndServe(":8080", router))
}
