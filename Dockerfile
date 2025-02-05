# Use Golang image as base
FROM golang:1.23.4-alpine as build

# Set working directory in the container
WORKDIR /app

# Copy go.mod and go.sum files to cache dependencies
COPY go.mod go.sum ./

# Download Go dependencies
RUN go mod tidy

# Copy the rest of the application code
COPY . .

# Install Air for hot-reloading (only needed in dev mode)
RUN go install github.com/cosmtrek/air@latest

# Build the Go application
RUN go build -o main .

# Stage for production
FROM alpine:latest

# Install necessary dependencies for running the Go app
RUN apk add --no-cache ca-certificates

# Set the working directory
WORKDIR /root/

# Copy the built application from the build stage
COPY --from=build /app/main .

# Expose the port the app runs on (change if needed)
EXPOSE 8080

# Command to run the application
CMD ["./main"]
