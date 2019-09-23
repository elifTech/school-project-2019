package devices

import (
    "fmt"
    "math/rand"
    "time"

    //"github.com/jinzhu/gorm"
)

const (
    minQualityWater = 0
    maxQualityWater = 16
)

type WaterQuality struct {
    Sensor
    Events []WaterQualityEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type WaterQualityEvent struct {
    Event
    Name    string  `json:"name"`
    Quality float32 `json:"quality"`
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

func (w *WaterQuality) ChangeSensorStatus(status SensorState) error {
    sensor, err := w.Get()
    if err != nil {
        fmt.Printf("Sensor is not found: %v \n", sensor)
        return nil
    }
    return Storage.Model(&sensor).Update("status", status).Error
}

func (w *WaterQuality) CreateEvent(payload *WaterQualityEvent) (err error) {
    // event should be populate with sensor type
    if len(payload.SensorType) == 0 {
        payload.SensorType = WaterQualitySensor
    }
    // a good example: we are returning the error directly from the Create method
    return Storage.Create(&payload).Error
}

func (w *WaterQuality) CreateWaterQualityEventRand() {
    var event WaterQualityEvent
    event.Name = "Quality of water"
    event.Quality = Random(minQualityWater, maxQualityWater)

    sensor, err := w.Get()
    if sensor.Status == StatusOffline {
        fmt.Printf("Water quality sensor is offline \n")
        return
    }

    err = w.CreateEvent(&event)
    if err != nil {
        fmt.Printf("Error: %s \n", err.Error())
        return
    }
    fmt.Printf("New event for water quality sensor is created \n")
}

func Random(min, max float32) float32 {
    rand.Seed(time.Now().Unix())
    return min + rand.Float32()*(max-min)
}
