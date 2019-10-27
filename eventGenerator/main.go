package main

import (
	"log"
	"net/http"
	"time"

	"github.com/subosito/gotenv"
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
	gotenv.Load()
	generate(5, GenerateWaterQualityEvent, GenerateWindEvent, GenerateCarbonEvent)
	generate(60, GenerateWaterMeterEvent)
	log.Fatal(http.ListenAndServe(":1234", nil))
}
