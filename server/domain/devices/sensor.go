package devices

import (
	"github.com/jinzhu/gorm"
	"time"
)

type SensorState int

const (
	StatusOffline SensorState = iota
	StatusPending
	StatusEnabling
	StatusOnline SensorState = 10
	StatusFailure
)

// we may use it for some future logic
// defining sensor types
//type SensorType string
//func (st SensorType) String() string {
//  return string(st)
//}

const (
	TemperatureSensor  string = "temperature"
	TemperatureSensor2 string = "temperature2"
  WaterQualitySensor string = "waterQuality"
)

type Sensor struct {
	gorm.Model
	SensorID uint `gorm:"primary_key;AUTO_INCREMENT"`
	Name     string
	Type     string
	Status   SensorState
}

type Event struct {
	gorm.Model
	EventID    uint `gorm:"primary_key;AUTO_INCREMENT"`
	Created    time.Time
	SensorType string `json:"device_type"`
}

func (e *Event) BeforeSave() (err error) {
	if e.Created.IsZero() {
		e.Created = time.Now()
	}

	return err
}
