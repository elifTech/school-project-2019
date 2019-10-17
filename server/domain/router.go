package domain

import (
	"school-project-2019/server/domain/routers"

	"github.com/julienschmidt/httprouter"
)

func (s *IoTService) NewRouter() *httprouter.Router {
	router := httprouter.New()
	// init our router
	routers.TemperatureInit(router)
	routers.AuthInit(router)
	routers.WindInit(router)
	routers.DashboardInit(router)

	return router
}
