package mongodb

import (
	"context"
	"crypto/rand"
	"fmt"
	"memo-note/graph/model"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var emailRegexp = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

var userCtxKey = &contextKey{"token"}

type contextKey struct {
	name string
}

func emailValidate(email string) error {
	if !emailRegexp.MatchString(email) {
		return fmt.Errorf("Email bad format")
	}
	return nil
}

func tokenGenerator() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func findUser(username string) (model.User, bool) {
	findOptions := options.Find()
	findOptions.SetLimit(1)

	cur, _ := Find("user", bson.D{{"username", username}}, findOptions)

	if cur == nil {
		return model.User{}, false
	}

	for cur.Next(context.TODO()) {
		var user model.User
		cur.Decode(&user)
		return user, true
	}

	return model.User{}, false
}

// Register User
func Register(user model.User) error {

	err := emailValidate(user.Email)
	if err != nil {
		return err
	}

	_, res := findUser(user.Username)

	if res {
		return fmt.Errorf("Username already exist")
	}
	user.ID = primitive.NewObjectID().String()
	_, errr := Insert("user", []interface{}{user})

	CreateIndex("session", bson.M{"expireAt": 1}, options.Index().SetExpireAfterSeconds(0))

	return errr
}

func findSession(token string, username string) (model.Session, bool) {
	findOptions := options.Find()
	findOptions.SetLimit(1)

	cur, _ := Find("session", bson.D{{"token", token}}, findOptions)

	for cur.Next(context.TODO()) {
		var session model.Session
		cur.Decode(&session)
		return session, true
	}

	cur, _ = Find("session", bson.D{{"username", username}}, findOptions)

	for cur.Next(context.TODO()) {
		var session model.Session
		cur.Decode(&session)
		return session, true
	}

	return model.Session{}, false
}

// Login User
func Login(username string, password string) (string, error) {

	user, res := findUser(username)
	if !res {
		return "", fmt.Errorf("Username not match")
	}

	if user.Password != password {
		return "", fmt.Errorf("Password not match")
	}

	sess, isExist := findSession("token", username)

	if isExist {
		return sess.Token, nil //fmt.Errorf("This user is already logined!")
	}

	token := tokenGenerator()
	session := model.Session{primitive.NewObjectID().String(), time.Now().Add(time.Hour * 1), username, token}

	_, err := Insert("session", []interface{}{session})
	UpdateSession(token)

	return token, err
}

// UpdateSession : Update User Login Info
func UpdateSession(token string) (string, error) {
	session, res := findSession(token, "user")
	if !res {
		return "", fmt.Errorf("Session expire")
	}

	_, err := Update("session", bson.D{{"token", token}}, bson.D{{"$set", bson.D{{"expireAt", time.Now().Add(time.Hour * 1)}}}})

	return session.Username, err
}

// Logout User
func Logout(username string) error {
	_, err := Delete("session", bson.D{{"username", username}})

	return err
}

// AuthMiddleware for graphqQL Authorization
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")
		if len(token) > 0 && token != "undefined" {
			_, err := UpdateSession(token)
			if err == nil {
				tokenValue := &contextKey{token}
				c.Request = c.Request.WithContext(context.WithValue(c.Request.Context(), userCtxKey, tokenValue))
			}
		}
		c.Next()
	}
}

// ForUserContext for recover token in context
func ForUserContext(ctx context.Context) string {
	raw, flag := ctx.Value(userCtxKey).(*contextKey)
	if !flag {
		return "undefined"
	}
	return raw.name
}
