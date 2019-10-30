package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"strconv"
)

type WindEvent struct {
	Power     float64
	Direction float64
	Beaufort  uint8
	Event     map[string]string
}

type Status struct {
	Status int
}

func GenerateWindEvent() {
	err := checkForStatus()
	if err != nil {
		fmt.Printf("Status is incorrect: %v\n", err)
		return
	}

	const (
		minPower float64 = 2
		maxPower float64 = 120
	)

	lastSpeed, err := getLastSpeed()
	if err != nil {
		fmt.Println("Server didnt respond with correct speed")
		return
	}
	var mean float64 = randMean(lastSpeed)
	if mean == -1 {
		return
	}
	var windPower float64 = math.Round(normPower(mean)*10) / 10
	if windPower < 1 {
		windPower = 20.0
	}
	var beaufortValue uint8 = uint8(math.Round(windPower / 10))
	if beaufortValue == 0 {
		beaufortValue = 1
	}

	reqBody := WindEvent{
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

func getLastSpeed() (float64, error) {
	res, err := http.Get("http://localhost:8080/wind/event/last")
	if err != nil {
		return -1, err
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return -1, err
	}

	power, err := strconv.ParseFloat(string(data), 64)
	if err != nil {
		return 0, nil
	}

	return power, nil
}

func checkForStatus() error {
	res, err := http.Get("http://localhost:8080/wind/status")
	if err != nil {
		return err
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var event Status
	err = json.Unmarshal(data, &event)
	if err != nil {
		return err
	}
	if event.Status != 1 {
		return errors.New("status is inactive")
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
	return rand.NormFloat64()*10 + lastSpeed
}
