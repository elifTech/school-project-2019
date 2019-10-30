package devices

import (
	"fmt"
	//"github.com/jinzhu/gorm"
)

//
type Temperature struct {
	Sensor
	Events []TemperatureEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

//
type TemperatureEvent struct {
	Event
	Name   string  `json:"name"`
	Degree float32 `json:"degree"`
}

func (Temperature) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", TemperatureSensor)
}

func (t *Temperature) GetSensor() ([]TemperatureEvent, error) {
	var device []TemperatureEvent
	err := Storage.Where(&Sensor{Type: WindSensor}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return device, err
}

func (t *Temperature) Get() ([]TemperatureEvent, error) {
	var device []TemperatureEvent
	err := Storage.Order("created_at").Find(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return device, err
}

func (t *Temperature) GetStatus() (*Temperature, error) {
	device := new(Temperature)
	err := Storage.Where(&Sensor{Type: TemperatureSensor}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}
	return device, err
}

func (t *Temperature) EventFilter(from string) ([]TemperatureEvent, error) {
	var events []TemperatureEvent

	var err error

	err = Storage.Where("created_at > ?", from).Order("created_at").Find(&events).Error
	fmt.Println(events)
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return events, err
}

func (t *Temperature) FindOneEvent(query TemperatureEvent) (*TemperatureEvent, error) {
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

// just for device initialising
func (t *Temperature) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := t.GetSensor()
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

func (t *Temperature) UpdateTemperatureSensorStatus(status SensorState) error {
	sensor, err := t.GetStatus()
	if err != nil {
		fmt.Printf("Sensor is not created")
		return ErrNotFound
	}
	sensor.Status = status
	return Storage.Save(&sensor).Error
}

func (t *Temperature) CreateEvent(payload *TemperatureEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = TemperatureSensor
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}
