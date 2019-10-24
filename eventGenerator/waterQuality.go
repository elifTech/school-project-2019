package main

import (
  "bytes"
  "encoding/json"
  "math/rand"
  "net/http"
  //"school-project-2019/server/domain/devices"
)

type WaterQualityEvent struct {
  Name    string  `json:"name"`
  Quality float64 `json:"quality"`
  Ca      float64
  Na      float64
  Mg      float64
  K       float64
}

func GenerateWaterQualityEvent() {
  payload := WaterQualityEvent{
    Name:    "Quality of water",
    Quality: NormGeneration(2, 7.5),
    Ca:      NormGeneration(17, 45),
    Na:      NormGeneration(10, 25),
    Mg:      NormGeneration(15, 30),
    K:       NormGeneration(5, 10),
  }
  payloadJson, _ := json.Marshal(payload)
  _, err := http.Post("http://localhost:8080/water_quality/event", "application/json", bytes.NewReader(payloadJson))
  if err != nil {
    err.Error()
  }
}

func NormGeneration(stdDev float64, mean float64) float64 {
  return rand.NormFloat64() * stdDev + mean
}
