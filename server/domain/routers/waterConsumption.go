package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
	"time"

	"github.com/julienschmidt/httprouter"
)

//WaterConsumptionInit ...
func WaterConsumptionInit(router *httprouter.Router) {
	// our DB instance passed as a local variable
	//db = database

	router.GET("/waterconsumption/", GetWaterMeterSensor)

	router.POST("/waterconsumption/poll", PollWaterConsumption)

	router.GET("/waterconsumption/all", AllWaterConsumption)

	router.GET("/waterconsumption/events", QueryWaterConsumption)
}

// GetWaterMeterSensor ...
func GetWaterMeterSensor(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	watermeter := devices.WaterConsumption{}
	device, err := watermeter.Get()
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

//AllWaterConsumption ...
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

//QueryWaterConsumption ...
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
