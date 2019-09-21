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

func WaterQualityInit(router *httprouter.Router) {
  // our DB instance passed as a local variable
  //db = database

  router.GET("/water_quality/ping", PingWaterQuality)

  router.POST("/water_quality/event", CreateWaterQualityEvent)
}

func PingWaterQuality(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  waterQuality := devices.WaterQuality{}
  device, err := waterQuality.Get()
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
  _, _ = w.Write(response)

  //fmt.Fprint(w, fmt.Sprintf("Pong... %v  ---- ERR: %v \n", device, err))
}

// test payload {"name": "dat", "quality": 10.234}
func CreateWaterQualityEvent(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  payload, err := ioutil.ReadAll(r.Body)
  defer r.Body.Close()

  if err != nil {
    http.Error(w, err.Error(), http.StatusNotAcceptable)
    return
  }

  var event devices.WaterQualityEvent
  err = json.Unmarshal(payload, &event)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  waterQuality := devices.WaterQuality{}
  err = waterQuality.CreateEvent(&event)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  w.WriteHeader(http.StatusCreated)

  _, _ = fmt.Fprintf(w, "%v", event)
}
