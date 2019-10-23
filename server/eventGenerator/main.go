package main

import (
  "log"
  "net/http"
  "time"
)

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
  Generator(5, GenerateWaterQualityEvent)
  log.Fatal(http.ListenAndServe(":1234", nil))
}