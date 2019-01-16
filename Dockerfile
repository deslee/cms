FROM golang:build

RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN go build -o main .