package devices

import (
	"fmt"
)

type Temperature struct {
	Sensor
	Events []TemperatureEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type TemperatureEvent struct {
	Event
	Name   string `json:"name"`
	Degree float32 `json:"degree"`
}

func (Temperature) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", TemperatureSensor)
}

func (t *Temperature) Get() (*Temperature, error) {
	device := new(Temperature)
	err := Storage.Where(&Sensor{Type: TemperatureSensor}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = NOT_FOUND
	}

	return device, err
}

func (t *Temperature) FindOneEvent(query TemperatureEvent) (*TemperatureEvent, error) {
	event := new(TemperatureEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = TemperatureSensor
	}
	err := Storage.Where(&query).First(&event).Error
	if err != nil {
		// returning custom DB error message
		err = NOT_FOUND
	}

	return event, err
}

// just for device initialising
func (t *Temperature) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := t.Get()
	if err == nil {
    fmt.Printf("Sensor is already created: %v \n", r)
    return nil
	}

	temperatureSensor := Sensor{
		Name:   "Temperature Sensor",
		Type:   TemperatureSensor,
		Status: StatusOffline,
	}
  fmt.Printf("Sensor is created %v \n", temperatureSensor)
  return Storage.Create(&temperatureSensor).Error
}

func (t *Temperature) CreateEvent(payload *TemperatureEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = TemperatureSensor
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}