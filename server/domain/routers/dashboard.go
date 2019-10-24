package routers

import (
	"encoding/json"
	"net/http"
	"school-project-2019/server/domain/devices"

	"github.com/julienschmidt/httprouter"
)

func DashboardInit(router *httprouter.Router) {
	router.GET("/sensors", GetAllSensors)
}

func GetAllSensors(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	sensor := devices.Sensor{}
	sensors, err := sensor.FindManySensors()
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, "no sensors in the database", http.StatusNotFound)
		return
	}

	response, err := json.Marshal(sensors)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}
