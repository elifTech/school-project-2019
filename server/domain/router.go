package domain

import (
	"github.com/julienschmidt/httprouter"
	"school-project-2019/server/domain/routers"
)

func NewRouter() *httprouter.Router {
	router := httprouter.New()
	// init our router
	routers.TemperatureInit(router)

	return router
}
