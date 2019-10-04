package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"strings"
	"time"

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
		Temperature: &devices.Temperature{},
	}

	s := &domain.IoTService{DB: db, Devices: &d}
	//storage.Storage = db
	router := s.NewRouter()

	s.DB.AutoMigrate(devices.TemperatureEvent{}, devices.Sensor{})
	// prepare device
	err = s.Devices.Temperature.CreateSensor()
	if err != nil {
		log.Fatal(fmt.Printf("Error creating device: %v \n", err))
		return
	}

	//ticker()

	// init server
	log.Fatal(http.ListenAndServe(":8080", router))
}

func ticker() {
	// ticker
	ticker := time.NewTicker(2 * time.Second)
	done := make(chan bool)

	offline := false

	go func() {
		for {
			select {
			case <-done:
				fmt.Printf("Closing now.... \n")
				ticker.Stop()
				return
			case t := <-ticker.C:

				payloadJson := GeneratePayload()
				// POST
				req, err := http.NewRequest("POST", "/temperature/ping", strings.NewReader(string(payloadJson)))
				if err != nil {
					offline = true
					done <- true
					fmt.Println("Tick at", t)
				}
				defer req.Body.Close()

				response, err := ioutil.ReadAll(req.Body)
				if err != nil {
					fmt.Printf("Error parsing response: %v \n", err)
					return
				}

				fmt.Println("Tick at", t, string(response))
			}
		}
	}()

	//defer func() {
	//  ticker.Stop()
	//  done <- true
	//}()

}

func GeneratePayload() []byte {
	// new source for random seed number generator
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)

	creationTime := time.Now()

	// preparing test payload
	payload := devices.TemperatureEvent{
		Name:   "Heat Device: 1 floor",
		Degree: float32(r1.NormFloat64() * 100),
		Event:  devices.Event{Created: creationTime},
	}
	// converting struct into byte slice
	payloadJson, _ := json.Marshal(payload)

	return payloadJson
}
