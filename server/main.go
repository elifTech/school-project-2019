package main

import (
	"log"
	"net/http"
	"school-project-2019/server/domain"
)

func main() {

	// init server
	log.Fatal(http.ListenAndServe(":8080", domain.NewRouter()))
}
