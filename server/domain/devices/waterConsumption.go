package devices

import (
	"fmt"
	//"github.com/jinzhu/gorm"
)

// WaterConsumption ...
type WaterConsumption struct {
	Sensor
	Events []WaterConsumptionEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

// WaterConsumptionEvent ...
type WaterConsumptionEvent struct {
	Event
	Name        string `json:"name"`
	Consumption float32
}

// TableName ...
func (WaterConsumption) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", WaterMeter)
}

// Get ...
func (wc *WaterConsumption) Get() (*[]WaterConsumptionEvent, error) {
	events := new([]WaterConsumptionEvent)
	err := Storage.Table("water_consumption_events").Where("sensor_type = ?", WaterMeter).Find(&events).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return events, err
}

// FindOneEvent ...
func (wc *WaterConsumption) FindOneEvent(query WaterConsumptionEvent) (*WaterConsumptionEvent, error) {
	event := new(WaterConsumptionEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = WaterMeter
	}
	err := Storage.Where(&query).First(&event).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return event, err
}

// CreateSensor is just for device initialising
func (wc *WaterConsumption) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := wc.Get()
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

// CreateEvent ...
func (wc *WaterConsumption) CreateEvent(payload *WaterConsumptionEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = WaterMeter
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}
