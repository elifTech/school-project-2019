package devices

import (
	"github.com/jinzhu/gorm"
	"time"
)

type DeviceState int

const (
	StatusOffline DeviceState = iota
	StatusPending
	StatusEnabling
	StatusOnline
	StatusFailure
)

type Device struct {
	gorm.Model
	ID   uint `gorm:"primary_key;AUTO_INCREMENT"`
	Name string
	Type string
}

type Event struct {
	gorm.Model
	ID         uint `gorm:"primary_key;AUTO_INCREMENT"`
	Created    time.Time
	DeviceType string `json:"device_type"`
}
