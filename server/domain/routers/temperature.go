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

// TemperatureInit ...
func TemperatureInit(router *httprouter.Router) {

	router.GET("/temperature/ping", PingTemperature)

	router.POST("/temperature/poll", PollTemperature)

	router.GET("/temperature/all", AllTemperature)
}

//PingTemperature ...
func PingTemperature(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	temperature := devices.Temperature{}
	device, err := temperature.Get()
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

// PollTemperature test payload []byte (`{"name": "dat", "degree": 20.123}`)
func PollTemperature(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	payload, err := ioutil.ReadAll(r.Body)
	//payload = []byte(`{"name": "Heat device: 2 floor", "degree": 23.125}`)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotAcceptable)
		return
	}

	var event devices.TemperatureEvent
	err = json.Unmarshal(payload, &event)
	fmt.Println(event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	temperature := devices.Temperature{}
	err = temperature.CreateEvent(&event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	fmt.Fprintf(w, "%v", event)
}

// AllTemperature ...
func AllTemperature(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	temperatureEvent := devices.Temperature{}
	device, err := temperatureEvent.Get()
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
