package routers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"school-project-2019/server/domain"
	"school-project-2019/server/domain/devices"
	"strings"
	"testing"
)

func TestPollTemperature(t *testing.T) {
	// creating the http test recorder to record the http request
	rr := httptest.NewRecorder()

	// creating the new http router from our main router struct
	router := domain.NewRouter()

	// preparing test payload
	payload := devices.TemperatureEvent{
		Name:   "Heat Device",
		Degree: 23.131,
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
	if rr.Body.String() != expected {
		t.Errorf("temperature handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}
