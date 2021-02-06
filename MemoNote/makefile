# server side
srv_dev:
	cd server && go run server.go

srv_test:
	cd server && go run main.go

srv_mod:
	cd server && go mod verify

srv_gql_init:
	cd server && go run github.com/99designs/gqlgen init

srv_gql_gen:
	cd server && go run github.com/99designs/gqlgen generate

srv_gql_done:
	cd server && go generate ./...

