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
func (wc *WaterConsumption) Get() (*WaterConsumption, error) {
	device := new(WaterConsumption)
	err := Storage.Where(&Sensor{Type: WaterMeter}).First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return device, err
}

// Ping ...
func (wc *WaterConsumption) Ping() (*[]WaterConsumptionEvent, error) {
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

// QueryEvents - find events by date and group ...
func (wc *WaterConsumption) QueryEvents(from string, to string) (*[]WaterConsumptionEvent, error) {
	var events []WaterConsumptionEvent
	var err error
	query := Storage.Table("water_consumption_events").Where("created BETWEEN ? AND ?", from, to)
	query = query.Select("date_trunc('minute', created) as created, sum(consumption) as consumption, max(event_id) as event_id")
	err = query.Group("date_trunc('minute', created)").Order("max(event_id)").Find(&events).Error

	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return &events, err
}

// // WeekEvents ...
// type WeekEvents struct {
// 	Day         time.Time
// 	Consumption float32
// }

// // GetWeek events ...
// func (wc *WaterConsumption) GetWeek() (*[]WeekEvents, error) {
// 	events := new([]WeekEvents)

// 	begd := func(t time.Time) time.Time {
// 		year, month, day := t.Date()
// 		return time.Date(year, month, day, 0, 0, 0, 0, t.Location())
// 	}
// 	begw := func(t time.Time) time.Time {
// 		w := begd(time.Now())
// 		weekStartDay := time.Monday
// 		weekday := int(w.Weekday())
// 		if weekStartDay != time.Sunday {
// 			weekStartDayInt := int(weekStartDay)
// 			if weekday < weekStartDayInt {
// 				weekday = weekday + 7 - weekStartDayInt
// 			} else {
// 				weekday = weekday - weekStartDayInt
// 			}
// 		}
// 		return w.AddDate(0, 0, -weekday)
// 	}

// 	now := time.Now()
// 	bow := begw(now)

// 	err := Storage.Table("water_consumption_events").Select("date_trunc('day', created) as day, sum(consumption) as consumption").Where("created BETWEEN ? AND ?", bow, now).Group("day").Find(&events).Error
// 	if err != nil {
// 		// returning custom DB error message
// 		err = ErrNotFound
// 	}

// 	return events, err
// }

// // MonthEvents ...
// type MonthEvents struct {
// 	Day         time.Time
// 	Consumption float32
// }

// // GetMonth  events ...
// func (wc *WaterConsumption) GetMonth() (*[]MonthEvents, error) {
// 	events := new([]MonthEvents)
// 	begm := func(t time.Time) time.Time {
// 		year, month, _ := t.Date()
// 		return time.Date(year, month, 1, 0, 0, 0, 0, t.Location())
// 	}
// 	now := time.Now()
// 	bom := begm(now)

// 	err := Storage.Table("water_consumption_events").Select("date_trunc('day', created) as day, sum(consumption) as consumption").Where("created BETWEEN ? AND ?", bom, now).Order("day").Group("day").Find(&events).Error
// 	if err != nil {
// 		// returning custom DB error message
// 		err = ErrNotFound
// 	}

// 	return events, err
// }

// // YearEvents ...
// type YearEvents struct {
// 	Month       time.Time
// 	Consumption float32
// }

// // GetYear  events ...
// func (wc *WaterConsumption) GetYear() (*[]YearEvents, error) {
// 	events := new([]YearEvents)
// 	begy := func(t time.Time) time.Time {
// 		year, _, _ := t.Date()
// 		return time.Date(year, time.January, 1, 0, 0, 0, 0, t.Location())
// 	}
// 	now := time.Now()
// 	boy := begy(now)

// 	err := Storage.Table("water_consumption_events").Select("date_trunc('month', created) as month, sum(consumption) as consumption").Where("created BETWEEN ? AND ?", boy, now).Group("month").Find(&events).Error
// 	if err != nil {
// 		// returning custom DB error message
// 		err = ErrNotFound
// 	}

// 	return events, err
// }