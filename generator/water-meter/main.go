package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

// type SensorState int

// const (
// 	StateNotFound SensorState = iota - 1
// 	StateDisabled
// 	StateActive
// )

// func (st SensorState) String() {
// 	select st {

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

func main() {
	// ticker
	ticker := time.NewTicker(30 * time.Second)
	done := make(chan bool)
	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		for {
			select {
			case <-done:
				fmt.Printf("Closing now.... \n")
				ticker.Stop()
				return
			case <-ticker.C:

				generatePayload()

			}
		}
	}()

	defer func() {
		fmt.Printf("Successfuly stoped ticker. \n")
		ticker.Stop()
		done <- true
	}()
	wg.Wait()

}

func generatePayload() {

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
			"sensor_type": "WaterMeter",
		},
	})

	if err != nil {
		fmt.Println("Could not convert to JSON")
	}

	fmt.Println("Random valie is ", randomConsumtion)

	req, err := http.Post("http://localhost:8080/waterconsumtion/poll", "application/json", bytes.NewBuffer(payloadJSON))
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
	res, err := http.Get("http://localhost:8080/waterconsumtion")
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
