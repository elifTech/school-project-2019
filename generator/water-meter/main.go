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

// type SensorState int

// const (
// 	StateNotFound SensorState = iota - 1
// 	StateDisabled
// 	StateActive
// )

// func (st SensorState) String() {
// 	switch st {

// 	case StateNotFound:
// 		return "not_found"

// 	case StateDisabled:
// 		return "disabled"

// 	case StateActive:
// 		return "online"
// 	}
// }

// Event ...
type Event struct {
	Status int
}

func generate(function func(), seconds int) {
	ticker := time.NewTicker(time.Duration(seconds) * time.Second)

	go func() {
		for {
			select {
			case <-ticker.C:
				function()
			}
		}
	}()
}

func main() {
	generate(generateWaterMeterEvent, 15)
	generate(generateWaterQualityEvent, 15)
	http.ListenAndServe(":1234", nil)
}

func generateWaterMeterEvent() {

	if statusCheck() != 1 {
		fmt.Printf("Device is not available. \n")
		return
	}

	rand.Seed(time.Now().UnixNano())
	// Theoretical min max consumtion per minute/10, liters
	const (
		min int = 1
		max int = 75
	)

	// new source for random seed number generator
	randomConsumtion := float32(rand.Intn(max-min+1)+min) / 10
	// creationTime := time.Now()

	// preparing payload
	payloadJSON, err := json.Marshal(map[string]interface{}{
		"name":        "Water Mater Main",
		"consumption": randomConsumtion,
		"Event": map[string]string{
			"sensor_type": "WaterConsumption",
		},
	})

	if err != nil {
		fmt.Println("Could not convert to JSON")
	}

	fmt.Println("Random valie is ", randomConsumtion)

	req, err := http.Post("http://localhost:8080/waterconsumption/poll", "application/json", bytes.NewBuffer(payloadJSON))
	if err != nil {
		fmt.Println("Error creating water meter event ")
	}
	defer req.Body.Close()

	response, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Printf("Error parsing response: %v \n", err)
		return
	}

	fmt.Println("Tick at \n", string(response))
}

func statusCheck() int {
	res, err := http.Get("http://localhost:8080/waterconsumption")
	if err != nil {
		return -1
	}
	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return -1
	}

	var event Event
	err = json.Unmarshal(data, &event)
	if err != nil || event.Status != 1 {
		fmt.Printf("Event %v \n", event.Status)
		return -1
	}
	fmt.Printf("Event %v \n", event.Status)
	return event.Status

}

type waterQualityEvent struct {
	Event
	Name    string  `json:"name"`
	Quality float64 `json:"quality"`
	Ca      float64
	Na      float64
	Mg      float64
	K       float64
}

func generateWaterQualityEvent() {

	payload := waterQualityEvent{
		Name:    "Quality of water",
		Quality: normGeneration(2, 6),
		Ca:      normGeneration(17, 45),
		Na:      normGeneration(10, 25),
		Mg:      normGeneration(15, 30),
		K:       normGeneration(5, 10),
	}
	payloadJSON, _ := json.Marshal(payload)
	req, err := http.Post("http://localhost:8080/water_quality/event", "application/json", bytes.NewBuffer(payloadJSON))
	if err != nil {
		fmt.Println("Error creating water quality event ")
	}
	defer req.Body.Close()

	response, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Printf("Error parsing response: %v \n", err)
		return
	}

	fmt.Println("Tick at \n", string(response))
}

func normGeneration(stdDev float64, mean float64) float64 {
	return rand.NormFloat64()*stdDev + mean
}
