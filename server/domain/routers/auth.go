package routers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"school-project-2019/server/domain/devices"
	"school-project-2019/server/domain/middlewares"

	"github.com/julienschmidt/httprouter"
)

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func AuthInit(router *httprouter.Router) {
	router.POST("/authenticate", middlewares.Authenticate)
	router.POST("/register", RegisterUser)
}

func RegisterUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	defer r.Body.Close()

	user := new(devices.User)
	rBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Wrong user credentials", http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(rBytes, user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user.Password = middlewares.GenerateHash([]byte(user.Password))
	err = user.Create()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Successfully registered!"))
}
