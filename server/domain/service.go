package domain

import (
	"github.com/jinzhu/gorm"
	"github.com/julienschmidt/httprouter"
)

type IoTService struct {
	DB     *gorm.DB
	Router *httprouter.Router
}
