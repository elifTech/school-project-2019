package devices

import (
	"fmt"
	"school-project-2019/server/storage"

	"github.com/jinzhu/gorm"
)

type Temperature struct {
	Sensor
	Events []TemperatureEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type TemperatureEvent struct {
	Event
	Name   string `json:"name"`
	Degree float32
}

var sensorType = "temperature"

func (Temperature) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", sensorType)
}

func (t *Temperature) Get(db *gorm.DB) (*Temperature, error) {
	device := &Temperature{}
	err := db.Where(&Sensor{Type: sensorType}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = storage.NOT_FOUND
	}

	return device, err
}

// just for device initialising
func (t *Temperature) CreateSensor(db *gorm.DB) error {
	// if device is found - do not do anything
	var err error
	r, err := t.Get(db)
	if err == nil {
		fmt.Printf("Not Creating Sensor: %v \n", r)
		return nil
	}

	fmt.Printf("Creating Sensor: %v \n", err)

	temperatureSensor := Sensor{
		Name:   "Temperature Sensor",
		Type:   sensorType,
		Status: StatusOffline,
	}
	return db.Create(&temperatureSensor).Error
}

func (t *Temperature) CreateEvent(db *gorm.DB, payload *TemperatureEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = sensorType
	}
	// a good example: we are returning the error directly from the Create method
	return db.Create(&payload).Error
}
