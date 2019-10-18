package routers

import (
	"encoding/json"
	"errors"
	"fmt"
	//"strconv"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"

	"github.com/julienschmidt/httprouter"
)

//Initialisation all routers
func CarbonInit(router *httprouter.Router) {
	// our DB instance passed as a local variable
	//db = database

	router.GET("/sensor/carbon/ping", PingCarbon)
	router.GET("/carbon", GetCarbonStatus)
	router.GET("/carbon/filter/events", FilterCarbonEvents)
	router.PUT("/sensor/carbon", UpdateCarbonSensor)
	router.POST("/sensor/carbon/poll", PollCarbon)
	
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

//
func FilterCarbonEvents(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	keys := r.URL.Query()
	from := keys.Get("from")
	carbon := devices.Carbon{}
	carbonEvent, err := carbon.EventFilter(from)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	response, err := json.Marshal(carbonEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(response)
}

//
func PingCarbon(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	carbon := devices.Carbon{}
	device, err := carbon.Get()
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
func GetCarbonStatus(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	carbon := devices.Carbon{}
	device, err := carbon.GetStatus()
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
func UpdateCarbonSensor(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	//defer r.Body.Close()
	carbon := devices.Carbon{}
	device, err := carbon.GetStatus()
	// testing custom error response
	if err == devices.ErrNotFound {
		http.Error(w, errors.New("the device is not found").Error(), http.StatusNotFound)
		return
	}
	
	r.ParseForm()
	//status, convErr := strconv.Atoi(r.Form.Get("status"))
	errStatus := json.NewDecoder(r.Body).Decode(&carbon)
	
	fmt.Println(carbon.Status)
	if errStatus != nil || carbon.Status != 0 && carbon.Status != 1 {
		http.Error(w, errors.New("Status is not correct").Error(), http.StatusBadRequest)
		return
	}
	err = device.UpdateSensorStatus(devices.SensorState(carbon.Status))

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("Status was changed!")
	w.WriteHeader(http.StatusOK)
}

// test payload {"name": "dat", "degree": 20.123}
func PollCarbon(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	payload, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotAcceptable)
		return
	}

	var event devices.CarbonEvent
	err = json.Unmarshal(payload, &event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	carbon := devices.Carbon{}
	err = carbon.CreateEvent(&event)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "%v", event)
}
