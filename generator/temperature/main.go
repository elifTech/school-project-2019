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
	Degree  int
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

	degree := r1.Intn(max-min+1) + min
	step := 1
	for {
		//moveStep := r1.Intn(3)

		moveStepFloat := rand.NormFloat64()*0.3 + 0

		moveStep := toFixed(moveStepFloat, 0)

		fmt.Printf("move step float is %v, move step is %v", moveStepFloat, moveStep)
		//fmt.Println("Max degree > max? %v", degree > max)
		//fmt.Println("max  %v, degree %v", max, degree)
		//increase temperature
		if degree > max {
			degree -= 3 * step
		} else if degree < min {
			degree += 3 * step
		} else if moveStep == 1 && degree <= max {
			degree += step
		} else if moveStep == -1 && degree >= min { //decrease temperature
			degree -= step
		}

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
