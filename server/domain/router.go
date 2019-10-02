package domain

import (
	"github.com/julienschmidt/httprouter"
	"school-project-2019/server/domain/routers"
)
// NewRouter ...
func (s *IoTService) NewRouter() *httprouter.Router {
	router := httprouter.New()
	// init our router
	routers.TemperatureInit(router)
	routers.WaterConsumptionInit(router) //init my router

	return router
}
