package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"

	"github.com/julienschmidt/httprouter"
)

//WaterConsumptionInit ...
func WaterConsumptionInit(router *httprouter.Router) {
	// our DB instance passed as a local variable
	//db = database

	router.GET("/waterconsumtion/ping", PingWaterConsumption)

	router.POST("/waterconsumtion/poll", PollWaterConsumption)

	router.GET("/waterconsumtion/all", AllWaterConsumption)

	router.GET("/waterconsumtion/today", DayWaterConsumption)

	router.GET("/waterconsumtion/week", WeekWaterConsumption)
}

// PingWaterConsumption ...
func PingWaterConsumption(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	waterconsumtion := devices.WaterConsumption{}
	device, err := waterconsumtion.Get()
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

	//fmt.Fprint(w, fmt.Sprintf("Pong... %v  ---- ERR: %v \n", device, err))
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

	waterconsumtion := devices.WaterConsumption{}
	err = waterconsumtion.CreateEvent(&event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	fmt.Fprintf(w, "%v", event)
}

//AllWaterConsumption ...
func AllWaterConsumption(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	waterconsumtionEvent := devices.WaterConsumption{}
	device, err := waterconsumtionEvent.GetAll()
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

//DayWaterConsumption ...
func DayWaterConsumption(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	waterconsumtionEvent := devices.WaterConsumption{}
	device, err := waterconsumtionEvent.GetToday()
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("Events per day are not found").Error(), http.StatusNotFound)
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

// WeekWaterConsumption ...
func WeekWaterConsumption(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	waterconsumtionEvent := devices.WaterConsumption{}
	device, err := waterconsumtionEvent.GetWeek()
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("Week events are not found").Error(), http.StatusNotFound)
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
