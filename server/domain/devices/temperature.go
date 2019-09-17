package devices

import (
	"github.com/jinzhu/gorm"
	"school-project-2019/server/storage"
	"time"
)

type Temperature struct {
	Device `gorm:"device"`
	Status DeviceState
	Events []TemperatureEvent `gorm:"foreignkey:DeviceType"`
}

type TemperatureEvent struct {
	Event  `gorm:"event"`
	Name   string `json:"name"`
	Degree float32
}

func (t *Temperature) Get(db *gorm.DB, id int) (device *Temperature, err error) {

	db.Table("temperature").Where("id", id).First(&device)
	if device == nil {
		err = storage.NOT_FOUND
	}

	return device, err
}

func (t *Temperature) CreateEvent(db *gorm.DB, payload *TemperatureEvent) (err error) {
	//
	//d.Service.DB.AutoMigrate(&Temperature{})
	// setup current date if empty
	if payload.Created.IsZero() {
		payload.Created = time.Now()
	}

	err = db.Table("temperature_events").Create(&payload).Error
	return err
}
