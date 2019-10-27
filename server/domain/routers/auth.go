package routers

import (
	"fmt"
	"io/ioutil"
	"encoding/json"
	"net/http"
	"school-project-2019/server/domain/devices"
	"school-project-2019/server/domain/middlewares"

	"github.com/julienschmidt/httprouter"
)

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

	err = user.Create(user)
	fmt.Println("user", user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var response string = fmt.Sprintf("%s", user.Email)
	w.Write([]byte(response))
}
