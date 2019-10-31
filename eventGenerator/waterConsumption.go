package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// WaterConsumptionStatus struct for checking device status
type WaterConsumptionStatus struct {
	Status int
}

// GenerateWaterConsumptionEvent generate random water consumption event
func GenerateWaterConsumptionEvent() {
	err := statusCheck()
	if err != nil {
		fmt.Printf("Water consumption status is incorrect: %v\n", err)
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

	// preparing payload
	payloadJSON, err := json.Marshal(map[string]interface{}{
		"name":        "Water Mater Main",
		"consumption": randomConsumtion,
		"WaterConsumptionEvent": map[string]string{
			"sensor_type": "WaterConsumption",
		},
	})

	if err != nil {
		fmt.Println("Could not convert to JSON")
	}

	fmt.Println("Water consumption random value is ", randomConsumtion)

	req, err := http.Post("http://localhost:8080/waterconsumption/poll", "application/json", bytes.NewBuffer(payloadJSON))
	if err != nil {
		fmt.Println("Error creating water consumption event ")
	}
	defer req.Body.Close()

	response, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Printf("Error parsing response: %v \n", err)
		return
	}

	fmt.Println("Water consumption event created ", string(response))
}

func statusCheck() error {
	res, err := http.Get("http://localhost:8080/waterconsumption")
	if err != nil {
		return err
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var event WaterConsumptionStatus
	err = json.Unmarshal(data, &event)
	if err != nil {
		return err
	}

	if event.Status == 0 {
		return errors.New("Water consumption Sensor is offline ")
	} else if event.Status == 2 {
		floodAlert()
		turnStatusBack()
		return errors.New("Flood sensor alert! ")

	}
	return nil
}

func floodAlert() {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	urlStr := fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", accountSid)

	floodAlertMessage := "Emergency alert. You've got flood at your home!"

	msgData := url.Values{}
	msgData.Set("To", os.Getenv("TWILIO_NUMBER_TO"))
	msgData.Set("From", os.Getenv("TWILIO_NUMBER_FROM"))
	msgData.Set("Body", floodAlertMessage)
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

func turnStatusBack() {

	client := &http.Client{}

	statusBack := WaterConsumptionStatus{
		Status: 1,
	}

	payloadJSON, err := json.Marshal(statusBack)

	request, err := http.NewRequest(http.MethodPut, "http://localhost:8080/waterconsumption", bytes.NewBuffer(payloadJSON))
	if err != nil {
		fmt.Println("Error creating water consumption event ")
	}
	defer request.Body.Close()

	response, err := client.Do(request)
	if err != nil {
		fmt.Printf("Error parsing response: %v \n", err)
		return
	}

	fmt.Println("Alert, status was changed back \n", response.Status)

}
