package devices

import (
  "bytes"
  "encoding/json"
  "errors"
  "fmt"
  "math/rand"
  "net/http"
  //"github.com/jinzhu/gorm"
)

const (
  mean   = 7
  stdDev = 2
  //minQualityWater = 0
  //maxQualityWater = 16
)

type WaterQuality struct {
  Sensor
  Events []WaterQualityEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type WaterQualityEvent struct {
  Event
  Name    string  `json:"name"`
  Quality float64 `json:"quality"`
}

func (WaterQuality) TableName() string {
  return "sensors"
}

func init() {
  fmt.Printf("Initializing %s sensor... \n", WaterQualitySensor)
}

func (w *WaterQuality) Get() (*WaterQuality, error) {
  waterQualitySensor := new(WaterQuality)
  err := Storage.Where(&Sensor{Type: WaterQualitySensor}).First(&waterQualitySensor).Error
  if err != nil {
    // returning custom DB error message
    err = NOT_FOUND
  }

  return waterQualitySensor, err
}

func (w *WaterQuality) GetAllEvents() ([] WaterQualityEvent, error) {
  var events [] WaterQualityEvent
  err := Storage.Find(&events).Error
  if err != nil {
    err = NOT_FOUND
  }
  return events, err
}

func (w *WaterQuality) GetPeriodEvents(period string) ([] WaterQualityEvent, error) {
  var events [] WaterQualityEvent
  //select date_trunc('minute', created) "hour", avg(quality) from water_quality_events group by minute;
  err := Storage.Select("date_trunc(?, created) as period, avg(quality) as quality", period).Group("period").Order("period").Find(&events).Error
  if err != nil {
    err = NOT_FOUND
  }
  return events, err
}


func (w *WaterQuality) FindOneEvent(query WaterQualityEvent) (*WaterQualityEvent, error) {
  event := new(WaterQualityEvent)

  if len(query.SensorType) == 0 {
    query.SensorType = WaterQualitySensor
  }
  err := Storage.Where(&query).First(&event).Error
  if err != nil {
    // returning custom DB error message
    err = NOT_FOUND
  }

  return event, err
}

// just for device initializing
func (w *WaterQuality) CreateSensor() error {
  // if device is found - do not do anything
  var err error
  r, err := w.Get()

  if err == nil {
    fmt.Printf("Sensor is already created: %v \n", r)
    return nil
  }

  waterQualitySensor := Sensor{
    Name:   "Water quality sensor",
    Type:   WaterQualitySensor,
    Status: StatusOffline,
  }

  fmt.Printf("Sensor is created %v \n", waterQualitySensor)
  return Storage.Create(&waterQualitySensor).Error
}

func (w *WaterQuality) ChangeSensorStatus(status SensorState) (SensorState, error) {
  sensor, err := w.Get()
  if err != nil {
    fmt.Printf("Sensor is not found: %v \n", sensor)
    return StatusFailure, errors.New("sensor is not found")
  }
  return sensor.Status, Storage.Model(&sensor).Update("status", status).Error
}

func (w *WaterQuality) CreateEvent(payload *WaterQualityEvent) (err error) {
  sensor, _ := w.Get()
  if sensor.Status != StatusOnline {
    fmt.Printf("Water quality sensor is offline \n")
    return errors.New("sensor is offline")
  }
  // event should be populate with sensor type
  if len(payload.SensorType) == 0 {
    payload.SensorType = WaterQualitySensor
  }
  err = Storage.Create(&payload).Error
  if err == nil {
    fmt.Printf("New event for water quality sensor is created \n")
  }
  return err
}

func PostCreateEvent() {
  payload := WaterQualityEvent{
    Name:    "Quality of water",
    Quality: NormGeneration(),
  }
  payloadJson, _ := json.Marshal(payload)
  _, err := http.Post("http://localhost:8080/water_quality/event", "application/json", bytes.NewReader(payloadJson))
  if err != nil {
    err.Error()
  }
}

func NormGeneration() float64 {
  return rand.NormFloat64() * stdDev + mean
}

//func (w *WaterQuality) CreateWaterQualityEventRand() {
//  var event WaterQualityEvent
//  event.Name = "Quality of water"
//  event.Quality = Random(minQualityWater, maxQualityWater)
//
//  sensor, err := w.Get()
//  if sensor.Status == StatusOffline {
//    fmt.Printf("Water quality sensor is offline \n")
//    return
//  }
//
//  err = w.CreateEvent(&event)
//  if err != nil {
//    fmt.Printf("Error: %s \n", err.Error())
//    return
//  }
//  fmt.Printf("New event for water quality sensor is created \n")
//}

//func Random(min, max float32) float32 {
//  rand.Seed(time.Now().Unix())
//  return min + rand.Float32()*(max-min)
//}
