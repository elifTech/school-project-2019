package devices

import (
	"fmt"
	//"github.com/jinzhu/gorm"
)

//
type Carbon struct {
	Sensor
	Events []CarbonEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

//
type CarbonEvent struct {
	Event
	Name   string `json:"name"`
	Signal int    `json:"signal"`
}

func (Carbon) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", CarbonSensor)
}

func (t *Carbon) Get() ([]CarbonEvent, error) {
	var device []CarbonEvent
	err := Storage.Order("created_at").Find(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return device, err
}

func (t *Carbon) GetStatus() (*Carbon, error) {
	device := new(Carbon)
	err := Storage.Where(&Sensor{Type: CarbonSensor}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}
	return device, err
}

func (t *Carbon) EventFilter(from string) ([]CarbonEvent, error) {
	var events []CarbonEvent

	var err error

	err = Storage.Where("created_at > ?", from).Order("created_at").Find(&events).Error
	fmt.Println(events)
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return events, err
}

func (t *Carbon) FindOneEvent(query CarbonEvent) (*CarbonEvent, error) {
	event := new(CarbonEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = CarbonSensor
	}
	err := Storage.Where(&query).First(&event).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return event, err
}

// just for device initialising
func (t *Carbon) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := t.Get()
	if err == nil {
		fmt.Printf("Not Creating Sensor: %v \n", r)
		return nil
	}

	fmt.Printf("Creating Sensor: %v \n", err)

	carbonSensor := Sensor{
		Name:   "Carbon Monoxide Sensor",
		Type:   CarbonSensor,
		Status: StatusOffline,
	}
	return Storage.Create(&carbonSensor).Error
}

func (t *Carbon) UpdateCarbonSensorStatus(status SensorState) error {
	sensor, err := t.GetStatus()
	if err != nil {
		fmt.Printf("Sensor is not created")
		return ErrNotFound
	}
	sensor.Status = status
	return Storage.Save(&sensor).Error
}

func (t *Carbon) CreateEvent(payload *CarbonEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = CarbonSensor
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}
