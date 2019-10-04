package middlewares

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"strings"
)

type User struct {
	Email    string `json:"email"`
	Password string
}

type JwtToken struct {
	Token string
}

type Exception struct {
	Message string
}

func Authenticate(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "invalid user data", http.StatusNotAcceptable)
		return
	}

	if !valid(&user) {
		http.Error(w, "invalid user credentials", http.StatusForbidden)
		return
	}

	json.NewEncoder(w).Encode(JwtToken{Token: signedTokenString(user)})
}

func Authorize(next httprouter.Handle) httprouter.Handle {
	return httprouter.Handle(func(w http.ResponseWriter, req *http.Request, params httprouter.Params) {
		bearerHeader := req.Header.Get("Authorization")
		// handle if we have the token
		if len(bearerHeader) == 0 {
			json.NewEncoder(w).Encode(Exception{Message: "An Authorization header is required"})
			return
		}

		bearerToken := strings.Split(bearerHeader, ":")
		if len(bearerToken) != 2 {
			json.NewEncoder(w).Encode(Exception{Message: "Invalid Authorization token"})
			return
		}

		token, err := parseBearer(bearerToken[1])
		if err != nil {
			json.NewEncoder(w).Encode(Exception{Message: err.Error()})
			return
		}

		// validate token
		if !token.Valid {
			json.NewEncoder(w).Encode(Exception{Message: "Invalid auth token"})
			return
		}

		// populating with context
		ctx := context.WithValue(req.Context(), "decoded", token.Claims)
		req.WithContext(ctx)

		next(w, req, nil)
	})
}

func parseBearer(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("error exception when signing token")
		}
		return []byte(secret), nil
	})
}

/*---------- HELPERS ---------*/

// mocked data
const (
	username = "test@t.com"
	pwd      = "eliftech"
	secret   = "Som35eCre7TokEn!"
)

func valid(user *User) bool {
	if user.Email == username && user.Password == pwd {
		return true
	}

	return false
}

// sign token
func signedTokenString(user User) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS384, jwt.MapClaims{
		"username": user.Email,
		"password": user.Password,
	})

	fmt.Printf("user %v \n", user)

	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Fatal(fmt.Sprintf("Error parsing: %v - %v \n", err, token))
		return ""
	}

	return tokenStr
}
