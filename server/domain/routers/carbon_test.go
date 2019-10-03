package routers_test

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/http/httptest"
	"school-project-2019/server/domain"
	"school-project-2019/server/domain/devices"
	"strings"
	"testing"
	"time"
)

func createNewService() *domain.IoTService {
	db, err := devices.Connect()
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting: %v \n", err))
		return nil
	}

	d := domain.Devices{
		Carbon: &devices.Carbon{},
	}

	return &domain.IoTService{DB: db, Devices: &d}
}

func TestPollCarbon(t *testing.T) {
	// creating the http test recorder to record the http request
	rr := httptest.NewRecorder()

	s := createNewService()
	if s == nil {
		t.Fatal(errors.New("can't create new service"))
	}
	// auto migration for tests
	s.DB.AutoMigrate(devices.CarbonEvent{}, devices.Sensor{})
	// we will close the DB connection when close the app process
	defer s.DB.Close()

	router := s.NewRouter()
	// creating the new http router from our main router struct
	//router := domain.NewRouter()

	// new source for random seed number generator
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)
	min := 35
	max := 50
	count := 0
	sensor := devices.Carbon{}
	creationTime := time.Now()
	for {
		count = count + 1
		if(count == 36){
			max = 800
			count = 0
		}
		sensorStatus := false
		time.Sleep(5 * time.Second)
		// preparing test payload
		payload := devices.CarbonEvent{
			Name:   "ASPR 650: Kitchen Room",
			Signal: r1.Intn(max-min+1) + min,
			Event:  devices.Event{Created: creationTime},
		}

		// converting struct into byte slice
		err := s.DB.Table("sensors").Where("type = ? AND status = ?", "Carbon Monoxide", "0").First(&sensor).Error
		if err != nil {
			fmt.Println("Device not found!")
			sensorStatus = true
		}

		if sensorStatus == false {
			payloadJson, _ := json.Marshal(payload)
			/*
			 * making request
			 * here we need to pass an io.Reader as the payload
			 * since strings.NewReader requires the string param, we need to convert byte slice into string
			 * string(payloadJson) - converts byte slice into string
			 */
			req, err := http.NewRequest("POST", "/sensor/carbon/poll", strings.NewReader(string(payloadJson)))
			if err != nil {
				t.Fatal(err)
			}
			req.Header.Add("Content-Type", "application/json")
			// serving http with our test request
			router.ServeHTTP(rr, req)
			fmt.Println(payload)
			// Check the status code is what we expect.
			if status := rr.Code; status != http.StatusCreated {
				t.Errorf("carbon monoxide handler returned wrong status code: got %v want %v",
					status, http.StatusOK)
				return
			}

			expect, err := s.Devices.Carbon.FindOneEvent(devices.CarbonEvent{Event: devices.Event{Created: creationTime}})
			if err != nil {
				t.Errorf("can't get the event from DB: %v",
					err.Error())
				return
			}

			// Check if the body returned is what we expected
			//expected := string(payloadJson)
			if fmt.Sprintf("%v", expect) != fmt.Sprintf("%v", payload) {
				t.Errorf("carbone monoxide handler returned unexpected body: got %v want %v",
					payload, expect)
			}
			sensorStatus = true
			max = 50;
		}
	}
}
