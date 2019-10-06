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

func createNewService1() *domain.IoTService {
	db, err := devices.Connect()
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting: %v \n", err))
		return nil
	}

	d := domain.Devices{
		WaterConsumption: &devices.WaterConsumption{},
	}

	return &domain.IoTService{DB: db, Devices: &d}
}

func TestWaterConsumption(t *testing.T) {
	// creating the http test recorder to record the http request
	rr := httptest.NewRecorder()

	s := createNewService()
	if s == nil {
		t.Fatal(errors.New("can't create new service"))
	}
	// auto migration for tests
	s.DB.AutoMigrate(devices.WaterConsumption{}, devices.Sensor{})
	// we will close the DB connection when close the app process
	defer s.DB.Close()

	router := s.NewRouter()
	// creating the new http router from our main router struct
	//router := domain.NewRouter()

	// new source for random seed number generator
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)

	creationTime := time.Now()

	// preparing test payload
	payload := devices.WaterConsumptionEvent{
		Name:        "Main Water Meter",
		Consumption: r1.Float32() * 10,
		Event:       devices.Event{Created: creationTime},
	}
	// converting struct into byte slice
	payloadJson, _ := json.Marshal(payload)
	/*
	 * making request
	 * here we need to pass an io.Reader as the payload
	 * since strings.NewReader requires the string param, we need to convert byte slice into string
	 * string(payloadJson) - converts byte slice into string
	 */
	req, err := http.NewRequest("POST", "/waterconsumtion/poll", strings.NewReader(string(payloadJson)))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Content-Type", "application/json")

	// serving http with our test request
	router.ServeHTTP(rr, req)
	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("water meter handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
		return
	}

	expect, err := s.Devices.WaterConsumption.FindOneEvent(devices.WaterConsumptionEvent{Event: devices.Event{Created: creationTime}})
	if err != nil {
		t.Errorf("can't get the event from DB: %v",
			err.Error())
		return
	}

	// Check if the body returned is what we expected
	//expected := string(payloadJson)
	if fmt.Sprintf("%v", expect) != fmt.Sprintf("%v", payload) {
		t.Errorf("water meter handler returned unexpected body: got %v want %v",
			payload, expect)
	}
}
