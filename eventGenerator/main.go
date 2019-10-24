package main

import (
	"log"
	"net/http"
	"time"
)

func generate(seconds int, functions ...func()) {
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
	generate(5, GenerateWaterQualityEvent, GenerateWaterMeterEvent, GenerateWindEvent)
	log.Fatal(http.ListenAndServe(":1234", nil))
}
