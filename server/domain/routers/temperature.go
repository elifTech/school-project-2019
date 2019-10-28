package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
	"time"

	//"time"
	"github.com/julienschmidt/httprouter"
)

//Initialisation all routers
func TemperatureInit(router *httprouter.Router) {
	// our DB instance passed as a local variable
	//db = database

	router.GET("/sensor/temperature/ping", PingTemperature)
	router.GET("/temperature", GetTemperatureStatus)
	router.GET("/temperature/filter/events", FilterTemperatureEvents)
	router.PUT("/sensor/temperature", UpdateTemperatureSensor)
	router.POST("/sensor/temperature/poll", PollTemperature)

}

// func enableCors(w *http.ResponseWriter) {
// 	(*w).Header().Set("Access-Control-Allow-Origin", "*")
// }

//
func FilterTemperatureEvents(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	keys := r.URL.Query()
	from := keys.Get("from")
	from = from[1 : len(from)-1] // deleting double quates
	tFrom, err := time.Parse(
		time.RFC3339,
		from)

	fmt.Printf("tFrom %v, from %v", from, tFrom)
	if err != nil {
		fmt.Printf("Error parsing time: %v \n", tFrom)
		return
	}

	temperature := devices.Temperature{}
	temperatureEvent, err := temperature.EventFilter(tFrom.Format("2006-01-02T15:04:05.999999-07:00"))

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response, err := json.Marshal(temperatureEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(response)
}

//
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
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)

	//fmt.Fprint(w, fmt.Sprintf("Pong... %v  ---- ERR: %v \n", device, err))
}

//
func GetTemperatureStatus(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	temperature := devices.Temperature{}
	device, err := temperature.GetStatus()
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

// Function for Update sensor status on front side
func UpdateTemperatureSensor(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	//defer r.Body.Close()
	temperature := devices.Temperature{}
	device, err := temperature.GetStatus()
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("the device is not found").Error(), http.StatusNotFound)
		return
	}

	r.ParseForm()
	//status, convErr := strconv.Atoi(r.Form.Get("status"))
	errStatus := json.NewDecoder(r.Body).Decode(&temperature)

	fmt.Println(temperature.Status)
	if errStatus != nil || temperature.Status != 0 && temperature.Status != 1 {
		http.Error(w, errors.New("Status is not correct").Error(), http.StatusBadRequest)
		return
	}
	err = device.UpdateTemperatureSensorStatus(devices.SensorState(temperature.Status))

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("Status was changed!")
	w.WriteHeader(http.StatusOK)
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
	err = temperature.CreateEvent(&event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "%v", event)
}
