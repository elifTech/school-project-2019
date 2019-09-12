package devices

import (
	"github.com/jinzhu/gorm"
)

type Temperature struct {
	gorm.Model
	Name   string
	Status DeviceState
}

type TemperatureEvent struct {
	Name     string
	DeviceId int32
	Degree   float32
}

func (t *Temperature) Get(id int) (device *Temperature, err error) {
	//
	//d.Service.DB.AutoMigrate(&Temperature{})

	//storage.DB.Table("device").Where("id", id).First(&device)
	//if device == nil {
	//  err = storage.NOT_FOUND
	//}

	return device, err
}
