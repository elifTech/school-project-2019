package devices

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (User) TableName() string {
	return "users"
}

func (t *User) Get(email string, password string) (*User, error) {
	user := new(User)
	err := Storage.Where(&User{Email: email, Password: password}).First(&user).Error

	return user, err
}

func (t *User) Create(user *User) error {
	return Storage.Create(&user).Error
}
