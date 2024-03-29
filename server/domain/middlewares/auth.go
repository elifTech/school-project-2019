package middlewares

import (
	"context"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"strings"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"school-project-2019/server/domain/devices"

	"github.com/dgrijalva/jwt-go"
	"github.com/julienschmidt/httprouter"
)

type JwtToken struct {
	Token string
}

type Exception struct {
	Message string
}

type Claims struct {
	Username string `json:"username"`
	Password string `json:"password"`
	jwt.StandardClaims
}

func Authenticate(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var user devices.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "invalid user data", http.StatusNotAcceptable)
		return
	}

	user.Password = GenerateHash([]byte(user.Password))
	if !valid(&user) {
		http.Error(w, "invalid user credentials", http.StatusForbidden)
		return
	}

	expirationTime := time.Now().Add(60 * time.Minute)
	json.NewEncoder(w).Encode(JwtToken{Token: signedTokenString(user, expirationTime)})
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

const (
	secret = "Som35eCre7TokEn!"
)

func GenerateHash(pwd []byte) string {
	hasher := sha1.New()
	hasher.Write(pwd)
	return base64.URLEncoding.EncodeToString(hasher.Sum(nil))
}

func valid(user *devices.User) bool {
	_, err := user.Get()
	if err != nil {
		return false
	}

	return true
}

// sign token
func signedTokenString(user devices.User, expirationTime time.Time) string {
	claims := &Claims{
		Username: user.Email,
		Password: user.Password,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS384, claims)

	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Fatal(fmt.Sprintf("Error parsing: %v - %v \n", err, token))
		return ""
	}

	return tokenStr
}
