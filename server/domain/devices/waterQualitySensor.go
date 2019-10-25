package devices

import (
	"errors"
	"fmt"
	"time"
)

type WaterQuality struct {
	Sensor
	Events []WaterQualityEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type WaterQualityEvent struct {
	Event
	Name    string  `json:"name"`
	Quality float64 `json:"quality"`
	Ca      float64
	Na      float64
	Mg      float64
	K       float64
}

type PeriodEvent struct {
	Period  time.Time `json:"period"`
	Quality float64   `json:"quality"`
}

type WaterStructure struct {
	Period time.Time `json:"period"`
	Ca     float64
	Na     float64
	Mg     float64
	K      float64
}

type Critic struct {
	Max float64 `json:"max"`
	Min float64 `json:"min"`
}

func (WaterQuality) TableName() string {
	return "sensors"
}

func init() {
	fmt.Printf("Initializing %s sensor... \n", WaterQualitySensor)
}

func (w *WaterQuality) Get() (*WaterQuality, error) {
	waterQualitySensor := new(WaterQuality)
	err := Storage.Where(&Sensor{Type: WaterQualitySensor}).First(&waterQualitySensor).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return waterQualitySensor, err
}

func (w *WaterQuality) GetAllEvents() ([]WaterQualityEvent, error) {
	var events []WaterQualityEvent
	err := Storage.Find(&events).Error
	if err != nil {
		err = ErrNotFound
	}
	return events, err
}

func (w *WaterQuality) GetPeriodEvents(period string) ([]PeriodEvent, error) {
	var events []PeriodEvent
	//select date_trunc('minute', created) "hour", avg(quality) from water_quality_events group by minute;
	err := Storage.Table("water_quality_events").
		Select("date_trunc(?, created) as period, avg(quality) as quality", period).
		Group("period").
		Order("period").
		Limit(50).
		Scan(&events).Error
	if err != nil {
		err = ErrNotFound
	}
	return events, err
}

func (w *WaterQuality) GetWaterStructure() (*WaterStructure, error) {
	lastDayEvent := new(WaterStructure)
	//select date_trunc('day', created) as period, avg(ca) ca, avg(mg) mg, avg(na) na, avg(k) k from water_quality_events group by period order by period desc limit 1;
	err := Storage.Table("water_quality_events").
		Select("date_trunc(?, created) as period, avg(ca) ca, avg(mg) mg, avg(na) na, avg(k) k", "day").
		Group("period").
		Order("period desc").
		Limit(1).
		Scan(&lastDayEvent).Error
	if err != nil {
		err = ErrNotFound
	}
	return lastDayEvent, err
}

func (w *WaterQuality) FindOneEvent(query WaterQualityEvent) (*WaterQualityEvent, error) {
	event := new(WaterQualityEvent)

	if len(query.SensorType) == 0 {
		query.SensorType = WaterQualitySensor
	}
	err := Storage.Where(&query).First(&event).Error
	if err != nil {
		// returning custom DB error message
		err = ErrNotFound
	}

	return event, err
}

// just for device initializing
func (w *WaterQuality) CreateSensor() error {
	// if device is found - do not do anything
	var err error
	r, err := w.Get()

	if err == nil {
		fmt.Printf("Sensor is already created: %v \n", r)
		return nil
	}

	waterQualitySensor := Sensor{
		Name:   "Water quality sensor",
		Type:   WaterQualitySensor,
		Status: StatusOffline,
	}

	fmt.Printf("Sensor is created %v \n", waterQualitySensor)
	return Storage.Create(&waterQualitySensor).Error
}

func (w *WaterQuality) ChangeSensorStatus(status SensorState) (SensorState, error) {
	sensor, err := w.Get()
	if err != nil {
		fmt.Printf("Sensor is not found: %v \n", sensor)
		return StatusFailure, errors.New("sensor is not found")
	}
	return sensor.Status, Storage.Model(&sensor).Update("status", status).Error
}

func (w *WaterQuality) CreateEvent(payload *WaterQualityEvent) (err error) {
	sensor, _ := w.Get()
	if sensor.Status != StatusOnline {
		fmt.Printf("Water quality sensor is offline \n")
		return errors.New("sensor is offline")
	}
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = WaterQualitySensor
	}
	err = Storage.Create(&payload).Error
	if err == nil {
		fmt.Printf("New event for water quality sensor is created \n")
	}
	return err
}

func (w *WaterQuality) GetCurrentEvent() (float64, error) {
	event := new(WaterQualityEvent)
	err := Storage.Select("quality").Order("created desc").First(event).Error
	if err != nil {
		err = ErrNotFound
	}
	return event.Quality, err
}

func (w *WaterQuality) GetCritical() (Critic, error) {
	var critic Critic
	err := Storage.Table("water_quality_events").Select("max(quality), min(quality)").Scan(&critic).Error
	if err != nil {
		err = ErrNotFound
	}
	return critic, err
}
