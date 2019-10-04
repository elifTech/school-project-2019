package devices

import (
	"fmt"
	"time"
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
	err := Storage.Table("water_consumption_events").Where("sensor_type = ?", WaterMeter).First(&events).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return events, err
}

// GetAll ...
func (wc *WaterConsumption) GetAll() (*[]WaterConsumptionEvent, error) {
	events := new([]WaterConsumptionEvent)
	err := Storage.Table("water_consumption_events").Where("sensor_type = ?", WaterMeter).Find(&events).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return events, err
}

// GetToday today events ...
func (wc *WaterConsumption) GetToday() (*[]WaterConsumptionEvent, error) {
	events := new([]WaterConsumptionEvent)
	dt := time.Now()
	dbefore := dt.AddDate(0, 0, -1)

	err := Storage.Table("water_consumption_events").Where("created BETWEEN ? AND ?", dbefore, dt).Find(&events).Error
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

// WeekEvents ...
type WeekEvents struct {
	Date  time.Time
	Total float32
}

// GetWeek today events ...
func (wc *WaterConsumption) GetWeek() (*[]WeekEvents, error) {

	events := new([]WeekEvents)

	dt := time.Now()
	dbefore := dt.AddDate(0, 0, -7)

	err := Storage.Table("water_consumption_events").Select("date(created) as date, sum(consumption) as total").Where("created BETWEEN ? AND ?", dbefore, dt).Group("date(created)").Find(&events).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return events, err
}
