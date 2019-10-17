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
	TemperatureSensor string = "temperature"
	WaterMeter        string = "WaterConsumption"
	WindSensor        string = "wind"
)

// Sensor ...
type Sensor struct {
	gorm.Model
	SensorID uint `gorm:"primary_key;AUTO_INCREMENT"`
	Name     string
	Type     string
	Status   SensorState
}

// Event ...
type Event struct {
	gorm.Model
	EventID    uint `gorm:"primary_key;AUTO_INCREMENT"`
	Created    time.Time
	SensorType string `json:"device_type"`
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
