package routers

import (
	"encoding/json"
	"fmt"
	"github.com/jinzhu/gorm"
	"github.com/julienschmidt/httprouter"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
)

var storage *gorm.DB

func TemperatureInit(router *httprouter.Router, db *gorm.DB) {

	storage = db

	router.GET("/temperature/ping", PingTemperature)

	router.POST("/temperature/poll", PollTemperature)
}

func PingTemperature(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	temperature := devices.Temperature{}
	device, err := temperature.Get(storage, 1)
	device2, err := temperature.Get(storage, 2)

	fmt.Fprint(w, fmt.Sprintf("Pong... %v %v  ---- ERR: %v \n", device, device2, err))
}

// test payload {"name": "dat", "degree": 20.123}
func PollTemperature(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	payload, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotAcceptable)
		return
	}

	var event devices.TemperatureEvent
	err = json.Unmarshal(payload, &event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	temperature := devices.Temperature{}
	err = temperature.CreateEvent(storage, &event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	fmt.Fprintf(w, "%v", event)
}
