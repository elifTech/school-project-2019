package devices

import (
	"time"

	"github.com/jinzhu/gorm"
)

type SensorState int

const (
	StatusOffline SensorState = iota
	StatusOnline
	StatusFailure
)

// we may use it for some future logic
// defining sensor types
//type SensorType string
//func (st SensorType) String() string {
//  return string(st)
//}

const (
	CarbonSensor string = "Carbon Monoxide"
)

//Sensors type with parameters
type Sensor struct {
	gorm.Model
	SensorID uint `gorm:"primary_key;AUTO_INCREMENT"`
	Name     string
	Type     string
	Status   SensorState `json:"status"`
}

// Request represents a request to run a command.
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
