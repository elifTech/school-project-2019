package routers_test

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/http/httptest"
	"school-project-2019/server/domain"
	"school-project-2019/server/domain/devices"
	"school-project-2019/server/storage"
	"strings"
	"testing"
	"time"
)

func TestPollTemperature(t *testing.T) {
	// creating the http test recorder to record the http request
	rr := httptest.NewRecorder()

	db, err := storage.Connect()
	if err != nil {
		log.Fatal(fmt.Printf("Error connecting: %v \n", err))
		return
	}
	// we will close the DB connection when close the app process
	defer db.Close()

	s := &domain.IoTService{DB: db}
	router := s.NewRouter()
	// creating the new http router from our main router struct
	//router := domain.NewRouter()

	// new source for random seed number generator
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)

	// preparing test payload
	payload := devices.TemperatureEvent{
		Name:   "Heat Device: 1 floor",
		Degree: r1.Float32() * 100,
	}
	// converting struct into byte slice
	payloadJson, _ := json.Marshal(payload)
	/*
	 * making request
	 * here we need to pass an io.Reader as the payload
	 * since strings.NewReader requires the string param, we need to convert byte slice into string
	 * string(payloadJson) - converts byte slice into string
	 */
	req, err := http.NewRequest("POST", "/temperature/poll", strings.NewReader(string(payloadJson)))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Content-Type", "application/json")

	// serving http with our test request
	router.ServeHTTP(rr, req)
	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("temperature handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
		return
	}

	// Check if the body returned is what we expected
	expected := string(payloadJson)
	if rr.Body.String() != fmt.Sprintf("%v", payload) {
		t.Errorf("temperature handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}
