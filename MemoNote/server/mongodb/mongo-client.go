package mongodb

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoClient : mongodb setting
type MongoClient struct {
	client   mongo.Client
	database mongo.Database
}

var mongoClient = MongoClient{}

func check() error {
	err := mongoClient.client.Ping(context.TODO(), nil)
	if err != nil {
		errr := Connect()
		if errr != nil {
			log.Fatal(errr)
			return errr
		}
	}

	return nil
}

// Connect to db
func Connect() error {

	clientOptions := options.Client().ApplyURI("mongodb://root:Cool199462@localhost:27017")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	mongoClient.client = *client

	if err != nil {
		log.Fatal(err)
		return err
	}

	mongoClient.database = *(mongoClient.client.Database("memo-note"))

	return nil
}

// DisConnect with db
func DisConnect() error {
	err := mongoClient.client.Disconnect(context.TODO())

	if err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}

// Insert multi documents
func Insert(channel string, documents []interface{}) (*mongo.InsertManyResult, error) {
	check() // mongo connectin check

	collection := mongoClient.database.Collection(channel)
	results, err := collection.InsertMany(context.TODO(), documents)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return results, err
}

// Find multi documents
func Find(channel string, filter interface{}, opts ...*options.FindOptions) (*mongo.Cursor, error) {
	check() // mongo connectin check

	collection := mongoClient.database.Collection(channel)
	results, err := collection.Find(context.TODO(), filter, opts...)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return results, err
}

// Update multi documents
func Update(channel string, filter interface{}, update interface{}, opts ...*options.UpdateOptions) (*mongo.UpdateResult, error) {
	check() // mongo connectin check

	collection := mongoClient.database.Collection(channel)
	results, err := collection.UpdateMany(context.TODO(), filter, update, opts...)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return results, err
}

// Delete multi documents
func Delete(channel string, filter interface{}, opts ...*options.DeleteOptions) (*mongo.DeleteResult, error) {
	check()

	collection := mongoClient.database.Collection(channel)
	results, err := collection.DeleteMany(context.TODO(), filter, opts...)

	if err != nil {
		log.Fatal(err)
		return &mongo.DeleteResult{}, err
	}

	return results, err
}

// CreateIndex : create index in mongodb
func CreateIndex(channel string, index interface{}, opts *options.IndexOptions) (string, error) {
	check()

	collection := mongoClient.database.Collection(channel)
	mod := mongo.IndexModel{
		Keys:    index,
		Options: opts,
	}
	ind, err := collection.Indexes().CreateOne(context.TODO(), mod)

	return ind, err
}
