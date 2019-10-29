package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type Sensor struct {
	ID       string `json: "ID"`
	DeviceID string `json: "DeviceID"`
	Name     string `json: "Name"`
	Model    string `json: "Model"`
	Signal   string `json: "Signal"`
	CurrTime string `json: "CurrTime"`
}

var sensors []Sensor

var db *sql.DB

func init() {
	var err error
	db, err = sql.Open("postgres", "user=postgres password=1 dbname=Sensor sslmode=disable")
	if err != nil {
		panic(err)
	}

	if err = db.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("You connected to your database.")

}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func getSignal(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "aplication/json")
	enableCors(&w)
	rows, err := db.Query("SELECT * FROM sensors ORDER BY currenttime")
	if err != nil {
		panic(err)
	}
	defer rows.Close()
	for rows.Next() {
		p := Sensor{}
		err := rows.Scan(&p.ID, &p.Name, &p.Model, &p.Signal, &p.CurrTime, &p.DeviceID)
		if err != nil {
			fmt.Println(err)
			continue
		}
		sensors = append(sensors, p)
		//fmt.Println(sensors)
	}
	json.NewEncoder(w).Encode(sensors)
	sensors = nil
}

func addSignal(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "aplication/json")
	var sensor Sensor
	_ = json.NewDecoder(req.Body).Decode(&sensor)
	db.QueryRow("insert into sensors (trans_id, name, model, signal, currenttime, device_id) values ($1, $2, $3, $4, $5, $6)",
		sensor.ID, sensor.Name, sensor.Model, sensor.Signal, sensor.CurrTime, sensor.DeviceID)
	fmt.Println(sensor)

}

func main() {

	//Init Router
	r := mux.NewRouter()

	//Router Handlers

	r.HandleFunc("/api/sensors", addSignal).Methods("POST")
	r.HandleFunc("/api/sensors", getSignal).Methods("GET")
	fmt.Println("Server running on 8080 port!")
	log.Fatal(http.ListenAndServe(":8080", r))
}
