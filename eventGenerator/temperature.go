package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"

	"net/http"
	"time"
)

type Temperature struct {
	Degree  float32
	Name    string
	Created time.Time
	Event   map[string]string
}

var s1 rand.Source = rand.NewSource(time.Now().UnixNano())
var r1 *rand.Rand = rand.New(s1)
var degree float32 = float32(r1.NormFloat64()*2 + 22)

func GenerateTemperatureEvent() {
	err := checkSensorsStatus()
	if err != nil {
		fmt.Printf("Couldn`t get a sensor's status: %v\n", err)
		return
	}

	fmt.Printf("1 degree %v, s1 %T, R1 %T\n", degree, s1, r1)

	min := 18
	max := 28

	moveStepFloat := r1.NormFloat64()*0.2 + 0

	moveStep := float32(toFixed(moveStepFloat, 1))

	fmt.Printf("2 move step is %v, degree %v\n", moveStep, degree)
	if degree > float32(max) {
		degree -= 2
	} else if degree < float32(min) {
		degree += 2
	} else { // change temperature
		degree += moveStep
	}

	degree = float32(toFixed(float64(degree), 1))

	creationTime := time.Now()

	payload := Temperature{
		Degree:  degree,
		Name:    "My house",
		Created: creationTime,
		Event: map[string]string{
			"sensor_type": "temperature",
		},
	}
	payloadJSON, _ := json.Marshal(payload)
	/*
	 * making request
	 * here we need to pass an io.Reader as the payload
	 * since strings.NewReader requires the string param, we need to convert byte slice into string
	 * string(payloadJSON) - converts byte slice into string
	 */
	if err != nil {
		fmt.Errorf("Couldn`t convert a request body to json \n", err)
		return
	}
	req, err := http.Post("http://localhost:8080/sensor/temperature/poll", "application/json", bytes.NewBuffer(payloadJSON))

	if err != nil {
		fmt.Errorf("Can't create a temerature event", err)
		return
	}
	fmt.Println("Temperature event was created:", bytes.NewBuffer(payloadJSON))
	req.Body.Close()
}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}
