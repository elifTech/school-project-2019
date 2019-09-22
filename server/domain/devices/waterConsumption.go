package devices

import (
	"fmt"
	//"github.com/jinzhu/gorm"
)

type WaterConsumption struct {
	Sensor
	Events []WaterConsumptionEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type WaterConsumptionEvent struct {
	Event
	Name   string `json:"name"`
	Consumption float32
}

func (WaterConsumption) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", WaterMeter)
}

func (m3 *WaterConsumption) Get() (*WaterConsumption, error) {
	device := new(WaterConsumption)
	err := Storage.Where(&Sensor{Type: WaterMeter}).Select("status").First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = NOT_FOUND
	}

	return device, err
}

func (m3 *WaterConsumption) FindOneEvent(query WaterConsumptionEvent) (*WaterConsumptionEvent, error) {
	event := new(WaterConsumptionEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = WaterMeter
	}
	err := Storage.Where(&query).First(&event).Error
	if err != nil {
		// returning custom DB error message
		err = NOT_FOUND
	}

	return event, err
}

// just for device initialising
func (m3 *WaterConsumption) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := m3.Get()
	if err == nil {
		fmt.Printf("Not Creating Sensor: %v \n", r)
		return nil
	}

	fmt.Printf("Creating Sensor: %v \n", err)

	waterMeter := Sensor{
		Name:   "Water Meter",
		Type:   WaterMeter,
		Status: StatusOffline,
	}
	return Storage.Create(&waterMeter).Error
}

func (m3 *WaterConsumption) CreateEvent(payload *WaterConsumptionEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = WaterMeter
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}
