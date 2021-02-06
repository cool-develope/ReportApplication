// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
package graph

import (
	"context"
	"fmt"
	"memo-note/graph/generated"
	"memo-note/graph/model"
	"memo-note/mongodb"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *mutationResolver) RegisterUser(ctx context.Context, input model.User) (*model.Session, error) {
	regError := mongodb.Register(input)
	if regError != nil {
		return &model.Session{}, regError
	}
	token, err := mongodb.Login(input.Username, input.Password)
	session := model.Session{primitive.NewObjectID().String(), time.Now(), input.Username, token}
	return &session, err
}

func (r *mutationResolver) LoginUser(ctx context.Context, input model.User) (*model.Session, error) {
	token, err := mongodb.Login(input.Username, input.Password)
	session := model.Session{primitive.NewObjectID().String(), time.Now(), input.Username, token}
	return &session, err
}

func (r *mutationResolver) LogoutUser(ctx context.Context, input model.User) (*model.Session, error) {
	err := mongodb.Logout(input.Username)
	return &model.Session{}, err
}

func (r *mutationResolver) UpdateBlog(ctx context.Context, input model.Blog) (*model.Blog, error) {
	token := mongodb.ForUserContext(ctx)
	_, err := mongodb.UpdateSession(token)

	if err != nil {
		return &model.Blog{}, err
	}

	var blog model.Blog
	if input.ID == "create" {
		blog, err = mongodb.CreateBlog(input)
	} else {
		blog, err = mongodb.UpdateBlog(input)
	}

	return &blog, err
}

func (r *mutationResolver) DeleteBlog(ctx context.Context, id string) (*model.Blog, error) {
	token := mongodb.ForUserContext(ctx)
	fmt.Println(token, id)
	_, err := mongodb.UpdateSession(token)

	if err != nil {
		return &model.Blog{}, err
	}

	err = mongodb.DeleteBlog(id)
	return &model.Blog{}, err
}

func (r *queryResolver) Blogs(ctx context.Context, section string) ([]*model.Blog, error) {
	if section != "news" {
		token := mongodb.ForUserContext(ctx)
		username, err := mongodb.UpdateSession(token)

		if err != nil {
			return make([]*model.Blog, 0), err
		}
		if section == "diary" || section == "note" || section == "task" {
			return mongodb.GetBlogs(section, username)
		}
	}
	blogs, err := mongodb.GetBlogs(section, "")

	return blogs, err
}

func (r *queryResolver) Blog(ctx context.Context, id string) (*model.Blog, error) {
	token := mongodb.ForUserContext(ctx)
	_, err := mongodb.UpdateSession(token)

	if err != nil {
		return &model.Blog{}, err
	}

	blog, err := mongodb.GetBlog(id)

	return blog, err
}

func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() generated.QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
