# Build stage
FROM golang:bookworm AS builder

WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code (including static and templates)
COPY . .

# Build the Go app
RUN go build -o server main.go

# Final runtime stage (smaller image)
FROM debian:bookworm-slim

WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/server .

# Copy static and templates directories into the container
COPY static /app/static
COPY templates /app/templates

# Expose the port
EXPOSE 8000

# Run the binary
CMD ["./server"]
