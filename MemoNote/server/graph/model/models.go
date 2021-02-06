package model

import (
	"time"
)

// Session Login Information
type Session struct {
	ID       string    `bson:"_id" json:"id,omitempty"`
	ExpireAt time.Time `json:"expireAt" bson:"expireAt"`
	Username string    `json:"username"`
	Token    string    `json:"token"`
}

// Blog model
type Blog struct {
	ID       string    `bson:"_id" json:"id,omitempty"`
	Title    string    `json:"title"`
	Section  string    `json:"section"`
	Avatar   string    `json:"avatar"`
	Content  string    `json:"content"`
	Username string    `json:"username"`
	CreateAt time.Time `bson:"createAt" json:"createAt"`
}

// User model
type User struct {
	ID       string `bson:"_id" json:"id,omitempty"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}
