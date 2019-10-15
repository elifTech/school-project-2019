package main

import (
	"bytes"
	"strconv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"time"
)

type Event struct {
	Power     float64
	Direction float64
	Beaufort  uint8
	Event     map[string]string
}

type Status struct {
	Status int
}

func setInterval(function func(), seconds int) {
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
	setInterval(GenerateWindEvents, 5)
	http.ListenAndServe(":1234", nil)
}

func GenerateWindEvents() {
	err := checkForStatus()
	if err != nil {
		fmt.Printf("Status is unacceptable %v", err)
		return
	}

	const (
		minPower float64 = 2
		maxPower float64 = 120
	)

	var mean float64 = randMean(getLastSpeed())
	if mean == -1 {
		return
	}
	var windPower float64 = math.Round(normPower(mean)*10) / 10
	var beaufortValue uint8 = uint8(math.Round(windPower / 10))
	if beaufortValue == 0 {
		beaufortValue = 1
	}

	reqBody := Event{
		Power:     windPower,
		Direction: randDirection(),
		Beaufort:  beaufortValue,
		Event: map[string]string{
			"device_type": "wind",
		},
	}

	reqBodyJSON, err := json.Marshal(reqBody)
	if err != nil {
		fmt.Println("Could not convert to json")
		return
	}
	req, err := http.Post("http://localhost:8080/wind/event", "application/json", bytes.NewBuffer(reqBodyJSON))

	if err != nil {
		fmt.Println("Cannot create wind event", err)
		return
	}
	fmt.Println("Wind event created")
	req.Body.Close()
}

func getLastSpeed() float64 {
	res, err := http.Get("http://localhost:8080/wind/event/last")
	if err != nil {

		return -1
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return -1
	}

	power, err := strconv.ParseFloat(string(data), 64)
	if err != nil {
		return 0
	}

	return power
}

func checkForStatus() error {
	res, err := http.Get("http://localhost:8080/wind")
	if err != nil {
		return err
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var event Status
	err = json.Unmarshal(data, &event)
	if err != nil || event.Status != 1 {
		return err
	}
	return nil
}

func randDirection() float64 {
	var randVal float64 = rand.NormFloat64() * 60
	return randVal
}

func normPower(mean float64) float64 {
	var sd float64 = 0.2
	return rand.NormFloat64()*sd + mean
}

func randMean(lastSpeed float64) float64 {
	if lastSpeed == -1 {
		return -1
	}
	if lastSpeed == 0 {
		lastSpeed = 20
	}
	return rand.NormFloat64()/10 + lastSpeed
}
