package main

import (
	"net/http"
	"time"
)

func generate(seconds int, functions ...func()) {
	ticker := time.NewTicker(time.Duration(seconds) * time.Second)

	go func() {
		for {
			select {
			case <-ticker.C:
				for _, f := range functions {
					f()
				}
			}
		}
	}()
}

func main() {
	generate(5, GenerateWindEvents)
	http.ListenAndServe(":1234", nil)
}
