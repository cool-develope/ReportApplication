FROM golang:1.15.8

ENV GO111MODULE=on

WORKDIR /app

COPY ./go.mod .

RUN go mod download

COPY . .
CMD ["go", "run", "server.go"]