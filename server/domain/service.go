package domain

import (
	"school-project-2019/server/domain/devices"

	"github.com/jinzhu/gorm"
	"github.com/julienschmidt/httprouter"
)

// IoTService ...
type IoTService struct {
	DB     *gorm.DB
	Router *httprouter.Router

	Devices *Devices
}

// Devices ... declare your device
type Devices struct {
	Temperature      *devices.Temperature
	WaterConsumption *devices.WaterConsumption //declaring my device
}
