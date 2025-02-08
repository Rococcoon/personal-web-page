# ---- Build Stage ----
FROM golang:bookworm AS builder

WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the .env file into the container
COPY .env /app/.env

# Copy the rest of the source code
COPY . .

# Install Air for hot-reloading (only needed in dev mode)
RUN go install github.com/air-verse/air@latest

# Build the Go app (only needed for production)
RUN go build -o server main.go

# ---- Runtime Stage ----
FROM debian:bookworm-slim

WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/server .

# Copy static and templates directories into the container
COPY static /app/static
COPY templates /app/templates

# ✅ Copy the .env file into the final container
COPY --from=builder /app/.env .env

# Expose the port
EXPOSE 42069

# Run the binary
CMD ["./server"]
