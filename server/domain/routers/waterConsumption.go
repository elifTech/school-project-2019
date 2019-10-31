package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
	"school-project-2019/server/domain/middlewares"
	"time"

	"github.com/julienschmidt/httprouter"
)

// Data struct for status processing
type Data struct {
	Status devices.SensorState
}

//WaterConsumptionInit initializes water consumption routes
func WaterConsumptionInit(router *httprouter.Router) {
	// our DB instance passed as a local variable
	//db = database

	router.GET("/waterconsumption", GetWaterConsumptionSensor)

	router.PUT("/waterconsumption", middlewares.Authorize(UpdateWaterConsumption))

	router.POST("/waterconsumption/poll", PollWaterConsumption)

	router.GET("/waterconsumption/all", middlewares.Authorize(AllWaterConsumption))

	router.GET("/waterconsumption/events", middlewares.Authorize(QueryWaterConsumption))
}

// GetWaterConsumptionSensor finds first water meter device
func GetWaterConsumptionSensor(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	waterconsumption := devices.WaterConsumption{}
	device, err := waterconsumption.Get()
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("the device is not found").Error(), http.StatusNotFound)
		return
	}

	response, err := json.Marshal(device)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

// PollWaterConsumption test payload {"name": "dat", "degree": 20.123}
func PollWaterConsumption(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	payload, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotAcceptable)
		return
	}

	var event devices.WaterConsumptionEvent
	err = json.Unmarshal(payload, &event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	waterconsumption := devices.WaterConsumption{}
	err = waterconsumption.CreateEvent(&event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	fmt.Fprintf(w, "%v", event)
}

//AllWaterConsumption finds all water meter events
func AllWaterConsumption(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	waterconsumptionEvent := devices.WaterConsumption{}
	device, err := waterconsumptionEvent.GetAll()
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("Events are not found").Error(), http.StatusNotFound)
		return
	}

	response, err := json.Marshal(device)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)

}

//QueryWaterConsumption finds  and groups all water meter events for specified period
func QueryWaterConsumption(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	q := r.URL.Query()
	from := q.Get("from")
	tFrom, err := time.Parse(
		time.RFC3339,
		from)
	if err != nil {
		fmt.Printf("Error parsing time: %v \n", tFrom)
		return
	}

	to := q.Get("to")

	tTo, err := time.Parse(
		time.RFC3339,
		to)

	waterconsumptionEvent := devices.WaterConsumption{}
	device, err := waterconsumptionEvent.QueryEvents(tFrom.Format("2006-01-02T15:04:05.999999-07:00"), tTo.Format("2006-01-02T15:04:05.999999-07:00"))
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("Events per selected period are not found").Error(), http.StatusNotFound)
		return
	}

	response, err := json.Marshal(device)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)

}

// UpdateWaterConsumption changes water meter status
func UpdateWaterConsumption(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	defer r.Body.Close()

	waterConsumption := devices.WaterConsumption{}
	_, err := waterConsumption.Get()
	if err == devices.ErrNotFound {
		http.Error(w, "the device is not found", http.StatusNotFound)
		return
	}

	var data Data

	rBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, devices.ErrBadStatus.Error(), http.StatusInternalServerError)
		return
	}
	err = json.Unmarshal(rBytes, &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updatedStatus, err := waterConsumption.UpdateWaterConsumptionStatus(data.Status)
	fmt.Println("status", updatedStatus)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response, err := json.Marshal(updatedStatus)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(response)
}
