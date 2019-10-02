package main

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/carlescere/scheduler"

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
		Temperature:      &devices.Temperature{},
		WaterConsumption: &devices.WaterConsumption{},
	}

	s := &domain.IoTService{DB: db, Devices: &d}
	//storage.Storage = db
	router := s.NewRouter()

	s.DB.AutoMigrate(devices.TemperatureEvent{}, devices.WaterConsumptionEvent{}, devices.Sensor{})
	// prepare device
	err = s.Devices.Temperature.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	err = s.Devices.WaterConsumption.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	// Gun for water consumtion ...
	gun := func() {
		// Theoretical min max consumtion per minute, liters
		min := 1
		max := 150

		// new source for random seed number generator
		randomConsumtion := float32(rand.Intn(max-min+1)+min) / 10
		creationTime := time.Now()

		// preparing payload
		payload := devices.WaterConsumptionEvent{
			Event:       devices.Event{Created: creationTime},
			Name:        "Water Meter main",
			Consumption: randomConsumtion,
		}
		// // converting struct into byte slice
		// payloadJSON, _ := json.Marshal(payload)

		// req, err := http.NewRequest("POST", "/waterconsumtion/poll", strings.NewReader(string(payloadJSON)))
		// if err != nil {
		// 	log.Fatal(fmt.Printf("Error creating new random event: %v \n", err))
		// }
		// req.Header.Add("Content-Type", "application/json")

		waterconsumtion := devices.WaterConsumption{}
		err = waterconsumtion.CreateEvent(&payload)

		fmt.Println("Random valie is ", randomConsumtion, creationTime, payload)
	}
	scheduler.Every(60).Seconds().Run(gun)

	// init server
	log.Fatal(http.ListenAndServe(":8080", router))
}
