package main

import (
	"fmt"
	"time"
)

func main() {
	// ticker
	ticker := time.NewTicker(2 * time.Second)
	done := make(chan bool)

	go func() {
		for {
			select {
			case <-done:
				return
			case t := <-ticker.C:

				fmt.Println("Tick at", t)
			}
		}
	}()

	defer func() {

		fmt.Printf("Successfully stoped ticker. \n")

		ticker.Stop()
		done <- true
	}()

}
