package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"time"

	"github.com/jasonlvhit/gocron"
)

func main() {
	s := gocron.NewScheduler()
	s.Every(5).Seconds().Do(GenerateWindEvents)
	s.Start()

	time.Sleep(10 * time.Minute)
}

func GenerateWindEvents() {
	const (
		minPower float64 = 2
		maxPower float64 = 120
	)

	var windPower float64 = math.Round(random(minPower, maxPower)*10)/10
	var beaufortValue uint8 = uint8(math.Round(windPower / 10))
	if(beaufortValue == 0) {
		beaufortValue = 1;
	}
	
	reqBody, err := json.Marshal(map[string]interface{}{
		"name":      "Outdoor wind state",
		"power":     windPower,
		"direction": "se",
		"beaufort":  beaufortValue,
		"state":     "Moderate",
		"Event": map[string]string{
			"device_type": "wind",
		},
	})

	if err != nil {
		fmt.Println("Could not convert to json")
	}

	res, err := http.Post("http://localhost:8080/wind/event", "application/json", bytes.NewBuffer(reqBody))

	if err != nil {
		fmt.Println("Cannot create wind event", err)
	} else {
		fmt.Println("Wind event created")
		defer res.Body.Close()
	}
}

func random(min, max float64) float64 {
	rand.Seed(time.Now().Unix())
	return min + rand.Float64()*(max-min)
}
