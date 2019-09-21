package domain

import (
	"github.com/jinzhu/gorm"
	"github.com/julienschmidt/httprouter"
	"school-project-2019/server/domain/devices"
)

type IoTService struct {
	DB     *gorm.DB
	Router *httprouter.Router

	Devices *Devices
}

// declare your device
type Devices struct {
	Temperature *devices.Temperature
	WaterQuality * devices.WaterQuality
}
