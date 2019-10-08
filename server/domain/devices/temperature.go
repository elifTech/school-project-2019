package devices

import (
	"fmt"
)

// Temperature ...
type Temperature struct {
	Sensor
	Events []TemperatureEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

// TemperatureEvent ...
type TemperatureEvent struct {
	Event
	Name   string `json:"name"`
	Degree float32 `json:"degree"`
}

// TableName ...
func (Temperature) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", TemperatureSensor)
}

// Get ...
func (t *Temperature) Get() (*Temperature, error) {
	device := new(Temperature)
	err := Storage.Where(&Sensor{Type: TemperatureSensor}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return device, err
}

// FindOneEvent ...
func (t *Temperature) FindOneEvent(query TemperatureEvent) (*TemperatureEvent, error) {
	event := new(TemperatureEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = TemperatureSensor
	}
	err := Storage.Where(&query).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return event, err
}

// FindAllEvent ...
func (t *Temperature) FindAllEvent(query TemperatureEvent) (*TemperatureEvent, error) {
	event := new(TemperatureEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = TemperatureSensor
	}
	err := Storage.Where(&query).First(&event).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return event, err
}

// CreateSensor just for device initialising
func (t *Temperature) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := t.Get()
	if err == nil {
		fmt.Printf("Not Creating Sensor: %v \n", r)
		return nil
	}

	fmt.Printf("Creating Sensor: %v \n", err)

	temperatureSensor := Sensor{
		Name:   "Temperature Sensor",
		Type:   TemperatureSensor,
		Status: StatusOffline,
	}
	return Storage.Create(&temperatureSensor).Error
}

// CreateEvent ...
func (t *Temperature) CreateEvent(payload *TemperatureEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = TemperatureSensor
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}
