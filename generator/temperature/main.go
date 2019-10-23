package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"time"
)

type Event struct {
	Degree  float32
	Name    string
	Created time.Time
	Event   map[string]string
}

type Status struct {
	Status int
}

func main() {
	createTemperatureEvent()
	http.ListenAndServe(":3003", nil)
}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func createTemperatureEvent() {
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)
	min := 18
	max := 28

	var degree float32 = float32(r1.Intn(max-min+1) + min)

	for {
		//moveStep := r1.Intn(3)

		moveStepFloat := rand.NormFloat64()*0.2 + 0

		//moveStep := toFixed(moveStepFloat, 1)
		moveStep := float32(toFixed(moveStepFloat, 1))
		//fmt.Printf("move step float is %v, move step is %v", moveStepFloat, moveStep)

		fmt.Printf(" move step is %v", moveStep)
		if degree > float32(max) {
			degree -= 2
		} else if degree < float32(min) {
			degree += 2
		} else { // change temperature
			degree += moveStep
		}

		degree = float32(toFixed(float64(degree), 1))

		creationTime := time.Now()
		fmt.Println(moveStep)

		sensorStatus := false
		time.Sleep(4 * time.Second)
		// preparing payload

		var event Status
		res, err := http.Get("http://localhost:8080/temperature")
		if err != nil {
			fmt.Println("Couldn`t get a sensor's status")
			return
		}
		data, err := ioutil.ReadAll(res.Body)
		err = json.Unmarshal(data, &event)
		fmt.Println(event.Status)
		if err == nil {
			if event.Status == 1 {
				fmt.Println("Port was closed!")
				sensorStatus = true
			}
		}
		payload := Event{
			Degree:  degree,
			Name:    "My house",
			Created: creationTime,
			Event: map[string]string{
				"sensor_type": "temperature",
			},
		}
		if sensorStatus == false {

			payloadJSON, _ := json.Marshal(payload)
			/*
			 * making request
			 * here we need to pass an io.Reader as the payload
			 * since strings.NewReader requires the string param, we need to convert byte slice into string
			 * string(payloadJSON) - converts byte slice into string
			 */
			if err != nil {
				fmt.Println("Couldn`t convert a request body to json")
				return
			}
			req, err := http.Post("http://localhost:8080/sensor/temperature/poll", "application/json", bytes.NewBuffer(payloadJSON))

			if err != nil {
				fmt.Println("Can't create a temperature event", err)
				return
			}
			fmt.Println("Temperature event was created:", bytes.NewBuffer(payloadJSON))
			req.Body.Close()
			sensorStatus = true

		}
	}
}
