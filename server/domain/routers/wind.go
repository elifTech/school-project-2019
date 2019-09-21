package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/jinzhu/gorm"
	"github.com/julienschmidt/httprouter"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
	"school-project-2019/server/storage"
)

var db *gorm.DB

func WindInit(router *httprouter.Router, database *gorm.DB) {
	// our DB instance passed as a local variable
	db = database

	router.GET("/wind/ping", PingWind)

	router.POST("/wind/poll", PollWind)
}

func PingWind(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	wind := devices.Wind{}
	device, err := wind.Get(db)
	// testing custom error response
	if err == storage.NOT_FOUND {
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
func PollWind(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
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
	err = wind.CreateEvent(db, &event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	fmt.Fprintf(w, "%v", event)
}
