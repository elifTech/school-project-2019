package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"time"
)

type Event struct {
	Signal  int
	Name    string
	Created time.Time
	Event   map[string]string
}

type Status struct {
	Status int
}

func main() {
	createCarbonEvent()
	http.ListenAndServe(":3003", nil)
}

func createCarbonEvent() {
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)
	min := 35
	max := 50
	count := 0

	for {
		signal := r1.Intn(max-min) + min
		creationTime := time.Now()
		count = count + 1
		if count == 36 {
			max = 999
			count = 0
		}
		sensorStatus := false
		time.Sleep(5 * time.Second)
		// preparing payload

		var event Status
		res, err := http.Get("http://localhost:8080/carbon")
		if err != nil {
			fmt.Println("Couldn`t get a sensor's status")
			return
		}
		data, err := ioutil.ReadAll(res.Body)
		err = json.Unmarshal(data, &event)
		if err == nil {
			if event.Status == 1 {
				fmt.Println("The port was closed!")
				sensorStatus = true
			}
		}
		payload := Event{
			Signal:  signal,
			Name:    "ASPR 650: Kitchen Room",
			Created: creationTime,
			Event: map[string]string{
				"sensor_type": "Carbon Monoxide",
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
			req, err := http.Post("http://localhost:8080/sensor/carbon/poll", "application/json", bytes.NewBuffer(payloadJSON))

			if err != nil {
				fmt.Println("Can't create a carbon event", err)
				return
			}
			fmt.Println("Carbon event was created:", bytes.NewBuffer(payloadJSON))
			req.Body.Close()
			sensorStatus = true
			max = 50
		}
	}
}
