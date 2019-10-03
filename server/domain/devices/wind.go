package devices

import (
	"fmt"
)

type Wind struct {
	Sensor
	Events []WindEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type WindEvent struct {
	Event
	Name          string  `json:"name"`
	Power         float32 `json:"power"`
	BeaufortValue uint8   `json:"beaufort"`
	Direction     string  `json:"direction"`
}

func (Wind) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", WindSensor)
}

func (t *Wind) Get() (*Wind, error) {
	device := new(Wind)
	err := Storage.Where(&Sensor{Type: WindSensor}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = NOT_FOUND
	}

	return device, err
}

func (t *Wind) UpdateWindStatus(status SensorState) (SensorState, error) {
	if status != StatusOnline && status != StatusOffline && status != StatusFailure {
		return StatusFailure, BAD_STATUS
	}

	sensor, err := t.Get()
	if err != nil {
		fmt.Printf("Wind Sensor is not created")
		return StatusFailure, NOT_FOUND
	}

	sensor.Status = status
	return status, Storage.Save(&sensor).Error
}

func (t *Wind) FindManyEvents(from string, to string) ([]WindEvent, error) {
	var events []WindEvent

	var err error
	if from != "" && to != "" {
		// in case user provides filter options
		err = Storage.Where("created_at BETWEEN ? AND ?", from, to).Find(&events).Error
	} else {
		err = Storage.Find(&events).Error
	}

	if err != nil {
		// returning custom DB error message
		err = NOT_FOUND
	}

	return events, err
}

func (t *Wind) FindOneEvent(query WindEvent) (*WindEvent, error) {
	event := new(WindEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = WindSensor
	}
	err := Storage.Where(&query).First(&event).Error
	if err != nil {
		// returning custom DB error message
		err = NOT_FOUND
	}

	return event, err
}

// just for device initialising
func (t *Wind) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := t.Get()
	if err == nil {
		fmt.Printf("Not Creating Sensor: %v \n", r)
		return nil
	}

	fmt.Printf("Creating Sensor: %v \n", err)

	windSensor := Sensor{
		Name:   "Wind Sensor",
		Type:   WindSensor,
		Status: StatusOffline,
	}
	return Storage.Create(&windSensor).Error
}

func (t *Wind) CreateEvent(payload *WindEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = WindSensor
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}
