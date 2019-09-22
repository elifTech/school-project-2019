package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
)

func WaterConsumptionInit(router *httprouter.Router) {
	// our DB instance passed as a local variable
	//db = database

	router.GET("/waterconsumtion/ping", PingWaterConsumption)

	router.POST("/waterconsumtion/poll", PollWaterConsumption)
}

func PingWaterConsumption(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	waterconsumtion := devices.WaterConsumption{}
	device, err := waterconsumtion.Get()
	// testing custom error response
	if err == devices.NOT_FOUND {
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

// test payload {"name": "dat", "degree": 20.123}
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
