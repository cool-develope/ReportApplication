FROM golang:1.15.8

ENV GO111MODULE=on

WORKDIR /app

COPY ./go.mod .

RUN go mod download

COPY . .

# RUN go run github.com/99designs/gqlgen init
# RUN go run github.com/99designs/gqlgen generate
# RUN go generate ./...

CMD ["go", "run", "server.go"]