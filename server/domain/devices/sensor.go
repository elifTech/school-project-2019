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
	StatusOnline
	StatusFailure
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
