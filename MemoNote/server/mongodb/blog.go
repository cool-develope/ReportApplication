package mongodb

import (
	"context"
	"fmt"
	"memo-note/graph/model"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// CreateBlog : create a blog
func CreateBlog(blog model.Blog) (model.Blog, error) {
	blog.ID = primitive.NewObjectID().String()
	if len(blog.Avatar) == 0 {
		blog.Avatar = "https://source.unsplash.com/random"
	}
	blog.CreateAt = time.Now()
	_, err := Insert("blog", []interface{}{blog})

	if err != nil {
		return model.Blog{}, fmt.Errorf("Create blog failed")
	}
	return blog, nil
}

// UpdateBlog : update a specific blog
func UpdateBlog(blog model.Blog) (model.Blog, error) {
	if len(blog.Avatar) == 0 {
		blog.Avatar = "https://source.unsplash.com/random"
	}
	_, err := Update("blog", bson.D{{"_id", blog.ID}}, bson.M{"$set": bson.M{
		"title":    blog.Title,
		"section":  blog.Section,
		"avatar":   blog.Avatar,
		"content":  blog.Content,
		"username": blog.Username,
	}})

	if err != nil {
		return model.Blog{}, fmt.Errorf("Update blog failed")
	}
	return blog, nil
}

// GetBlogs : get blogs same section
func GetBlogs(section string, username string) ([]*model.Blog, error) {
	options := options.Find()
	// Sort by `_id` field descending
	options.SetSort(bson.D{{"createAt", -1}})

	// Limit by 10 documents only
	options.SetLimit(50)

	if username == "" {
		cur, err := Find("blog", bson.M{"section": section}, options)
		res := make([]*model.Blog, 0)
		for cur.Next(context.TODO()) {
			var blog model.Blog
			cur.Decode(&blog)
			res = append(res, (&blog))
		}
		return res, err
	} else {
		cur, err := Find("blog", bson.M{"section": section, "username": username}, options)
		res := make([]*model.Blog, 0)
		for cur.Next(context.TODO()) {
			var blog model.Blog
			cur.Decode(&blog)
			res = append(res, (&blog))
		}
		return res, err
	}

}

func GetBlog(id string) (*model.Blog, error) {
	cur, err := Find("blog", bson.M{"_id": id}, options.Find().SetLimit(1))

	for cur.Next(context.TODO()) {
		var blog model.Blog
		cur.Decode(&blog)
		return &blog, nil
	}

	return &model.Blog{}, err
}

// DeleteBlog : delete the specific blog
func DeleteBlog(id string) error {
	_, err := Delete("blog", bson.M{"_id": id}, options.Delete())
	return err
}
