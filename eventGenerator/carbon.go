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
	"time"
)

type Carbon struct {
	Signal  int
	Name    string
	Created time.Time
	Event   map[string]string
}

func GenerateCarbonEvent() {
	err := checkSensorsStatus()
	if err != nil {
		fmt.Printf("Couldn`t get a sensor's status: %v\n", err)
		return
	}

	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)
	min := 35.0
	max := 50.0
	count := 0
	signal := int(math.Abs(r1.NormFloat64()*(max-min+1) + min))
	creationTime := time.Now()
	count = count + 1
	if count == 36 {
		max = 999
		count = 0
	}
	payload := Carbon{
		Signal:  signal,
		Name:    "ASPR 650: Kitchen Room",
		Created: creationTime,
		Event: map[string]string{
			"sensor_type": "Carbon Monoxide",
		},
	}
	payloadJSON, _ := json.Marshal(payload)
	/*
	 * making request
	 * here we need to pass an io.Reader as the payload
	 * since strings.NewReader requires the string param, we need to convert byte slice into string
	 * string(payloadJSON) - converts byte slice into string
	 */
	if err != nil {
		fmt.Errorf("Couldn`t convert a request body to json \n", err)
		return
	}
	req, err := http.Post("http://localhost:8080/sensor/carbon/poll", "application/json", bytes.NewBuffer(payloadJSON))

	if err != nil {
		fmt.Errorf("Can't create a carbon event", err)
		return
	}
	fmt.Println("Carbon event was created:", bytes.NewBuffer(payloadJSON))
	req.Body.Close()
	max = 50
}

func checkSensorsStatus() error {
	res, err := http.Get("http://localhost:8080/carbon")
	if err != nil {
		fmt.Errorf("Couldn`t get a sensor's status", err)
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
	if event.Status == 1 {
		return errors.New("The port was closed!")
	}
	return nil
}
