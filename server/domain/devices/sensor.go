package devices

import (
	"time"

	"github.com/jinzhu/gorm"
)

// SensorState ...
type SensorState int

// SensorState ...
const (
	StatusOffline SensorState = iota
	StatusOnline
	StatusFailure
)

// we may use it for some future logic
// defining sensor types
// type SensorType string
// func (st SensorType) String() string {
//  return string(st)
// }
// Sensors ...
const (
	CarbonSensor           string = "Carbon Monoxide"
	TemperatureSensor      string = "temperature"
	WaterConsumptionSensor string = "waterConsumption"
	WindSensor             string = "wind"
	WaterQualitySensor     string = "waterQuality"
)

// Sensor ...

type Sensor struct {
	gorm.Model
	SensorID uint `gorm:"primary_key;AUTO_INCREMENT"`
	Name     string
	Type     string
	Status   SensorState
}

// Request represents a request to run a command.

// Event ...

type Event struct {
	gorm.Model
	EventID    uint      `gorm:"primary_key;AUTO_INCREMENT" json:"eventId"`
	Created    time.Time `json:"created"`
	SensorType string    `json:"device_type"`
}

func (s *Sensor) FindManySensors() ([]Sensor, error) {
	var sensors []Sensor

	err := Storage.Find(&sensors).Error

	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}
	return sensors, err

}

// BeforeSave sets current time if Created field is empty
func (e *Event) BeforeSave() (err error) {
	if e.Created.IsZero() {
		e.Created = time.Now()
	}

	return err
}
