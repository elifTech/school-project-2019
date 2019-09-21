package domain

import (
	"github.com/julienschmidt/httprouter"
	"school-project-2019/server/domain/routers"
)

func (s *IoTService) NewRouter() *httprouter.Router {
	router := httprouter.New()
	// init our router
	routers.TemperatureInit(router, s.DB)
	routers.WindInit(router, s.DB)

	return router
}
