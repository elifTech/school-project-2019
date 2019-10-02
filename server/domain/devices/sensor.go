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
	StatusPending
	StatusEnabling
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
	WaterMeter        string = "WaterConsumption" // my water meter
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

// BeforeSave ...
func (e *Event) BeforeSave() (err error) {
	if e.Created.IsZero() {
		e.Created = time.Now()
	}

	return err
}
