package domain

import (
	"school-project-2019/server/domain/routers"

	"github.com/julienschmidt/httprouter"
)

// NewRouter ...
func (s *IoTService) NewRouter() *httprouter.Router {
	router := httprouter.New()
	// init our router
	routers.TemperatureInit(router)
	routers.WaterConsumptionInit(router)
	routers.WindInit(router)
	routers.DashboardInit(router)
	routers.WaterQualityInit(router)

	return router
}
