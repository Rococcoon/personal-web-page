# Use the official Golang image with Bookworm
FROM golang:bookworm

# Set working directory in the container
WORKDIR /app

# Copy go.mod and go.sum files to cache dependencies
COPY go.mod go.sum ./

# Download Go dependencies
RUN go mod tidy

# Copy the rest of the application code
COPY . .

# Install Air for hot-reloading (only needed in dev mode)
RUN go install github.com/air-verse/air@latest

# Build the Go application
RUN go build -o main .

# Expose the port the app runs on (change if needed)
EXPOSE 8000

# Command to run the application
CMD ["./main"]
