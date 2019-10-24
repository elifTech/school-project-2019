package main

import (
  "github.com/jinzhu/gorm"
  "log"
  "net/http"
  "time"
)

type Event struct {
  gorm.Model
  EventID    uint      `gorm:"primary_key;AUTO_INCREMENT"`
  Created    time.Time `json:"created"`
  SensorType string    `json:"device_type"`
}

func Generator(seconds int, functions ...func()) {
  ticker := time.NewTicker(time.Duration(seconds) * time.Second)

  go func() {
    for {
      select {
      case <-ticker.C:
        for _, function := range functions {
          function()
        }
      }
    }
  }()
}

func main() {
  Generator(5, GenerateWaterQualityEvent, GenerateWaterMeterEvent)
  log.Fatal(http.ListenAndServe(":1234", nil))
}
