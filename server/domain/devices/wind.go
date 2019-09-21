package devices

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"school-project-2019/server/storage"
)

type Wind struct {
	Sensor
	Events []WindEvent `gorm:"foreignkey:SensorType;association_foreignkey:Type"`
}

type WindEvent struct {
	Event
	Name   string `json:"name"`
	Power float32
	Direction string
}

func (Wind) TableName() string {
	return "devices"
}

func init() {
	fmt.Printf("Initalising %s sensor... \n", "wind")
}

func (t *Wind) Get(db *gorm.DB) (*Wind, error) {
	device := new(Wind)
	err := db.Where(&Sensor{Type: "wind"}).Select("status").First(&device).Error
	if err != nil {
		// returning custom DB error message
		err = storage.NOT_FOUND
	}

	return device, err
}

// just for device initialising
func (t *Wind) CreateSensor(db *gorm.DB) error {
	// if device is found - do not do anything
	var err error
	r, err := t.Get(db)
	if err == nil {
		fmt.Printf("Not Creating Sensor: %v \n", r)
		return nil
	}

	fmt.Printf("Creating Sensor: %v \n", err)

	windSensor := Sensor{
		Name:   "Wind Sensor",
		Type:   "wind",
		Status: StatusOffline,
	}
	return db.Create(&windSensor).Error
}

func (t *Wind) CreateEvent(db *gorm.DB, payload *WindEvent) (err error) {
	// event should be populate with sensor type
	if len(payload.SensorType) == 0 {
		payload.SensorType = sensorType
	}
	// a good example: we are returning the error directly from the Create method
	return db.Create(&payload).Error
}
