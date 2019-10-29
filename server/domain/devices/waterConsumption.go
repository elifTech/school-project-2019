package devices

import (
	"fmt"
	"time"
	//"github.com/jinzhu/gorm"
)

// WaterConsumption creates structure for water meter device
type WaterConsumption struct {
	Sensor
	Events []WaterConsumptionEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

// WaterConsumptionEvent implements events for water meter device
type WaterConsumptionEvent struct {
	Event
	Name        string `json:"name"`
	Consumption float32
}

// TableName initializes sensors
func (WaterConsumption) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initializing %s sensor... \n", WaterMeter)
}

// Get finds first water meter device
func (wc *WaterConsumption) Get() (*WaterConsumption, error) {
	device := new(WaterConsumption)
	err := Storage.Where(&Sensor{Type: WaterMeter}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return device, err
}

// GetAll finds all water meter events
func (wc *WaterConsumption) GetAll() (*[]WaterConsumptionEvent, error) {
	events := new([]WaterConsumptionEvent)
	err := Storage.Table("water_consumption_events").Where("sensor_type = ?", WaterMeter).Find(&events).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return events, err
}

// FindOneEvent finds first water meter event
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
		fmt.Printf("Water consumption sensor initialized: %v \n", r)
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

// CreateEvent creates water meter event with relevant payload
func (wc *WaterConsumption) CreateEvent(payload *WaterConsumptionEvent) (err error) {

	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = WaterMeter
	}
	// a good example: we are returning the error directly from the Create method
	return Storage.Create(&payload).Error
}

// QueryWaterConsumptionEvents struct for water meter querying
type QueryWaterConsumptionEvents struct {
	EventID     uint
	Created     time.Time
	Consumption float32
}

// QueryEvents finds events by date and groups them
func (wc *WaterConsumption) QueryEvents(from string, to string) (*[]QueryWaterConsumptionEvents, error) {
	var events []QueryWaterConsumptionEvents
	var err error
	query := Storage.Table("water_consumption_events").Where("created BETWEEN ? AND ?", from, to)
	query = query.Select("date_trunc('hour', created) as created, sum(consumption) as consumption, max(event_id) as event_id")
	err = query.Group("date_trunc('hour', created)").Order("event_id").Find(&events).Error

	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return &events, err
}

// UpdateWaterMeterStatus changes water meter status
func (wc *WaterConsumption) UpdateWaterMeterStatus(status SensorState) (SensorState, error) {
	if status != StatusOnline && status != StatusOffline && status != StatusFailure {
		return StatusFailure, ErrBadStatus
	}

	sensor, err := wc.Get()
	if err != nil {
		fmt.Printf("Wind Sensor is not created")
		return StatusFailure, ErrNotFound
	}

	sensor.Status = status
	return status, Storage.Save(&sensor).Error
}
