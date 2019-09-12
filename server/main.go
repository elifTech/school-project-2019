package main

import (
	//"fmt"
	//"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"net/http"
	"school-project-2019/server/domain"
	//"school-project-2019/server/storage"
)

func main() {
	// init DB
	//db, err := storage.Connect()
	//if err != nil {
	//	log.Fatal(fmt.Printf("Error connecting: %v \n", err))
	//	return
	//}
	//defer db.Close()

	//s := &domain.IoTService{DB: db}
	//s.DB.AutoMigrate()
	// init server
	log.Fatal(http.ListenAndServe(":8080", domain.NewRouter()))
}
