package devices

import (
	"errors"
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

func (u *User) Get() (*User, error) {
	user := new(User)
	err := Storage.Where(&u).First(&user).Error

	return user, err
}

func (u *User) Create() error {
	var user User
	err := Storage.Where(&User{Email: u.Email}).Find(&user).Error
	if err == nil {
		return errors.New("User already exists")
	}

	return Storage.Create(&u).Error
}
