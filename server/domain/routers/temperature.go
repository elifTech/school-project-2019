package routers

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	//"school-project-2019/server/protocols/http"
	"net/http"
)

func TemperatureInit(router *httprouter.Router) {

	router.GET("/temperature/ping", PingTemperature)
}

func PingTemperature(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Pong...")
}

func PollTemperature(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Pong...")
}
