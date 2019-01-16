FROM golang:1.11.4 AS builder
WORKDIR /src
COPY ./go.mod ./go.sum ./
RUN go mod download
COPY ./ ./
RUN CGO_ENABLED=1 go build -o admin-jobs jobprocessor/assetJob.go
RUN CGO_ENABLED=1 go build -o admin-http server/server.go

FROM golang:1.11.4 AS admin-http
WORKDIR /app
EXPOSE 80
ENV PORT=80
COPY --from=builder /src /app
ENTRYPOINT ["/app/admin-http"]

FROM golang:1.11.4 AS admin-jobs
WORKDIR /app
COPY --from=builder /src /app
ENTRYPOINT ["/app/admin-jobs"]