package routers

import (
  "encoding/json"
  "errors"
  "github.com/jasonlvhit/gocron"
  "github.com/julienschmidt/httprouter"
  "io/ioutil"
  "net/http"
  "school-project-2019/server/domain/devices"
)

func WaterQualityInit(router *httprouter.Router) {
  // our DB instance passed as a local variable
  //db = database

  cron := gocron.NewScheduler()
  cron.Every(30).Seconds().Do(devices.PostCreateEvent)
  cron.Start()

  router.GET("/water_quality/ping", PingWaterQuality)

  router.PUT("/water_quality/status", ChangeWaterQualityStatus)

  router.POST("/water_quality/event", CreateWaterQualityEvent)

  router.GET("/water_quality/event", GetPeriodEvents)
  router.GET("/water_quality/current", GetCurrent)
  router.GET("/water_quality/critic", GetCritic)
  router.GET("/water_quality/structure", GetWaterStructure)

  router.GET("/water_quality/events", GetEvents)

}

func PingWaterQuality(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  waterQuality := devices.WaterQuality{}
  device, err := waterQuality.Get()
  // testing custom error response
  if err == devices.ErrNotFound {
    http.Error(w, errors.New("the water quality sensor is not found").Error(), http.StatusNotFound)
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

// test payload {"status": 10}
func ChangeWaterQualityStatus(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  var waterQuality devices.WaterQuality

  payload, err := ioutil.ReadAll(r.Body)
  defer r.Body.Close()

  if err != nil {
    http.Error(w, err.Error(), http.StatusNotAcceptable)
    return
  }
  err = json.Unmarshal(payload, &waterQuality)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  status, err := waterQuality.ChangeSensorStatus(waterQuality.Status)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  type Status struct {
    Status devices.SensorState
  }
  response, err := json.Marshal(Status{Status: status})
  if err != nil {
    http.Error(w, err.Error(), http.StatusNotFound)
    return
  }
  w.WriteHeader(http.StatusOK)
  _, _ = w.Write(response)
}

func GetEvents(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  var waterQuality devices.WaterQuality
  _, err := waterQuality.Get()
  if err == devices.ErrNotFound {
    http.Error(w, errors.New("the water quality sensor is not found").Error(), http.StatusNotFound)
    return
  }
  events, err := waterQuality.GetAllEvents()
  //if len(events) == 0 {
  //    // no events
  //}
  response, err := json.Marshal(events)
  if err != nil {
    http.Error(w, err.Error(), http.StatusNotFound)
    return
  }
  w.Header().Set("Content-Type", "application/json")
  _, _ = w.Write(response)
}

// test query ?period=hour
func GetPeriodEvents(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  payload, isOk := r.URL.Query()["period"]

  if !isOk || len(payload[0]) < 1 {
    http.Error(w, "Url Param 'period' is missing", http.StatusBadRequest)
    return
  }

  var waterQuality devices.WaterQuality
  _, err := waterQuality.Get()
  if err == devices.ErrNotFound {
    http.Error(w, errors.New("the water quality sensor is not found").Error(), http.StatusNotFound)
    return
  }
  period := payload[0]
  events, err := waterQuality.GetPeriodEvents(period)
  response, err := json.Marshal(events)
  if err != nil {
    http.Error(w, err.Error(), http.StatusNotFound)
    return
  }
  w.Header().Set("Content-Type", "application/json")
  _, _ = w.Write(response)
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
}

func GetCurrent(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  var waterQuality devices.WaterQuality

  current, err := waterQuality.GetCurrentEvent()
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  type CurrentQuality struct {
    Quality float64 `json:"quality"`
  }
  response, err := json.Marshal(CurrentQuality{Quality: current})
  if err != nil {
    http.Error(w, err.Error(), http.StatusNotFound)
    return
  }
  w.WriteHeader(http.StatusOK)
  _, _ = w.Write(response)
}

func GetCritic(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  var waterQuality devices.WaterQuality

  critic, err := waterQuality.GetCritical()
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  response, err := json.Marshal(critic)
  if err != nil {
    http.Error(w, err.Error(), http.StatusNotFound)
    return
  }
  w.WriteHeader(http.StatusOK)
  _, _ = w.Write(response)
}

func GetWaterStructure(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  var waterQuality devices.WaterQuality

  waterStructure, err := waterQuality.GetWaterStructure()
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  response, err := json.Marshal(waterStructure)
  if err != nil {
    http.Error(w, err.Error(), http.StatusNotFound)
    return
  }
  w.WriteHeader(http.StatusOK)
  _, _ = w.Write(response)
}
