package domain

import (
	"github.com/julienschmidt/httprouter"
	"school-project-2019/server/domain/routers"
)

func (s *IoTService) NewRouter() *httprouter.Router {
	router := httprouter.New()
	// init our router
	routers.TemperatureInit(router)
	routers.WaterQualityInit(router)
	routers.WindInit(router)
	routers.DashboardInit(router)

	return router
}
