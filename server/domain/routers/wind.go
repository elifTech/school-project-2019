package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func WindInit(router *httprouter.Router) {
	router.GET("/wind", GetWindSensor)
	router.GET("/wind/events", FindWindEvents)
	router.POST("/wind/event", CreateWindEvent)
	router.PUT("/wind", UpdateWindSensor)
}

func GetWindSensor(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	wind := devices.Wind{}
	device, err := wind.Get()
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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(response)
}

func UpdateWindSensor(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	defer r.Body.Close()

	wind := devices.Wind{}
	_, err := wind.Get()
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("the device is not found").Error(), http.StatusNotFound)
		return
	}

	r.ParseForm()
	status, convErr := strconv.Atoi(r.Form.Get("status"))
	// if user provides string or not supported status number
	if convErr != nil || status != 0 && status != 1 && status != 2 {
		http.Error(w, errors.New("Status is not correct").Error(), http.StatusBadRequest)
		return
	}
	err = wind.UpdateWindStatus(devices.SensorState(status))

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func FindWindEvents(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	keys := r.URL.Query()
	from := keys.Get("from")
	to := keys.Get("to")

	wind := devices.Wind{}
	windEvents, err := wind.FindManyEvents(from, to)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response, err := json.Marshal(windEvents)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(response)
}

func CreateWindEvent(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	payload, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotAcceptable)
		return
	}

	var event devices.WindEvent
	err = json.Unmarshal(payload, &event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	wind := devices.Wind{}
	err = wind.CreateEvent(&event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	fmt.Fprintf(w, "%v", event)
}
