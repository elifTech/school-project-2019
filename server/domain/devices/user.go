package devices

import (
	"crypto/sha1"
	"encoding/base64"
	"fmt"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (User) TableName() string {
	return "users"
}

func generateHash(pwd []byte) string {
	hasher := sha1.New()
	hasher.Write(pwd)
	return base64.URLEncoding.EncodeToString(hasher.Sum(nil))
}

func (t *User) Get(email string, password string) (*User, error) {
	user := new(User)
	var hashedPWD string = generateHash([]byte(password))
	fmt.Println(hashedPWD)
	err := Storage.Where(&User{Email: email, Password: hashedPWD}).First(&user).Error

	return user, err
}

func (t *User) Create(user *User) error {
	var hash string = generateHash([]byte(user.Password))
	t.Password = hash
	return Storage.Create(&user).Error
}
