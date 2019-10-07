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
			case t := <-ticker.C:

				payloadJSON := generatePayload()
				req, err := http.Post("http://localhost:8080/waterconsumtion/poll", "application/json", bytes.NewBuffer(payloadJSON))
				if err != nil {
					done <- true
					fmt.Println("Error creating water meter event ", t)
				}
				defer req.Body.Close()

				response, err := ioutil.ReadAll(req.Body)
				if err != nil {
					fmt.Printf("Error parsing response: %v \n", err)
					return
				}

				fmt.Println("Tick at \n", t, string(response))
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

func generatePayload() []byte {
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

	return payloadJSON
}
