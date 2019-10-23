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
	router.GET("/sensor/temperature/ping", PingTemperature)
	router.GET("/temperature", GetTemperatureStatus)
	router.GET("/temperature/filter/events", FilterTemperatureEvents)
	router.PUT("/sensor/temperature", UpdateTemperatureSensor)
	router.POST("/sensor/temperature/poll", PollTemperature)
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func FilterTemperatureEvents(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	keys := r.URL.Query()
	from := keys.Get("from")
	temperature := devices.Temperature{}
	temperatureEvent, err := temperature.EventFilter(from)
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
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

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
