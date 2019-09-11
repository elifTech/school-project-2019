package routers

import (
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
)

func TemperatureInit(router *httprouter.Router) {

	router.GET("/temperature/ping", PingTemperature)

	router.POST("/temperature/poll", PollTemperature)
}

func PingTemperature(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Pong...")
}

// test payload {"name": "dat", "degree": 20.123}
func PollTemperature(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
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

	w.WriteHeader(http.StatusCreated)

	fmt.Fprintf(w, "%s", payload)
}
