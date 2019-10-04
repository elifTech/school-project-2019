package routers

import (
	"github.com/julienschmidt/httprouter"
	"school-project-2019/server/domain/middlewares"
)

func AuthInit(router *httprouter.Router) {
	router.POST("/authenticate", middlewares.Authenticate)
}
