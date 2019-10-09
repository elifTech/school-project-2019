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
	Status int
}

func setInterval(function func(), seconds int) {
	ticker := time.NewTicker(time.Duration(seconds) * time.Second)
	done := make(chan bool)

	go func() {
		for {
			select {
			case <-ticker.C:
				function()
			case <-done:
				ticker.Stop()
				return
			}
		}
	}()
}

func main() {
	setInterval(GenerateWindEvents, 5)
	http.ListenAndServe(":1234", nil)
}

func GenerateWindEvents() {
	if checkForStatus() != 1 {
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

	reqBody, err := json.Marshal(map[string]interface{}{
		"power":     windPower,
		"direction": randDirection(),
		"beaufort":  beaufortValue,
		"Event": map[string]string{
			"device_type": "wind",
		},
	})

	if err != nil {
		fmt.Println("Could not convert to json")
	}

	req, err := http.Post("http://localhost:8080/wind/event", "application/json", bytes.NewBuffer(reqBody))

	if err != nil {
		fmt.Println("Cannot create wind event", err)
	} else {
		fmt.Println("Wind event created")
		defer req.Body.Close()
	}
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

	var power float64
	err = json.Unmarshal(data, &power)
	if err != nil {
		return 0
	}

	return power
}

func checkForStatus() int {
	res, err := http.Get("http://localhost:8080/wind")
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
		return -1
	}
	return event.Status
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
