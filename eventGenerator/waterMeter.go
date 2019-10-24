package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"strings"
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

// WaterMeterEvent ...
type WaterMeterEvent struct {
	Status int
}

func GenerateWaterMeterEvent() {

	// fmt.Printf(" StatusCheck. %v \n", StatusCheck())

	switch StatusCheck() {
	case 0:
		fmt.Printf("Device is not available. \n")
		return
	case 2:
		TurnStatusBack()
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
		"WaterMeterEvent": map[string]string{
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

func StatusCheck() int {
	res, _ := http.Get("http://localhost:8080/waterconsumption")

	data, _ := ioutil.ReadAll(res.Body)

	var event WaterMeterEvent
	_ = json.Unmarshal(data, &event)

	fmt.Printf("Event %v \n", event.Status)
	return event.Status

}

func FloodAler() {
	accountSid := "AC8ae8ca965a1405ffae8a82cd23580008"
	authToken := "1e42243a9a632ad5cb78fc4267611f7b"
	urlStr := "https://api.twilio.com/2010-04-01/Accounts/AC8ae8ca965a1405ffae8a82cd23580008/Messages.json"

	floodAlert := "Emergency alert. You've got flood at your home!"

	msgData := url.Values{}
	msgData.Set("To", "+380632431866")
	msgData.Set("From", "+13343800573")
	msgData.Set("Body", floodAlert)
	msgDataReader := *strings.NewReader(msgData.Encode())

	client := &http.Client{}
	req, _ := http.NewRequest("POST", urlStr, &msgDataReader)
	req.SetBasicAuth(accountSid, authToken)
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, _ := client.Do(req)
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		var data map[string]interface{}
		decoder := json.NewDecoder(resp.Body)
		err := decoder.Decode(&data)
		if err == nil {
			fmt.Println(data["sid"])
		}
	} else {
		fmt.Println(resp.Status)
	}

}

func TurnStatusBack() {

	payloadJSON, err := json.Marshal("1")
	reqs, err := http.NewRequest(http.MethodPut, "http://localhost:8080/waterconsumption", strings.NewReader(string(payloadJSON)))
	if err != nil {
		fmt.Println("Error creating water meter event ")
	}
	defer reqs.Body.Close()

	response, err := ioutil.ReadAll(reqs.Body)
	if err != nil {
		fmt.Printf("Error parsing response: %v \n", err)
		return
	}

	fmt.Println("Alert, status was changed back \n", string(response))

}
