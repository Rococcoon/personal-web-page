package config

import (
  "log"
  "os"
  "github.com/joho/godotenv"
  )

type Config struct {
  EmailUser string
  EmailPassword string
  EmailHost string
  EmailPort string
  RecipientEmail string
}

func LoadConfig() *Config {
  err := godotenv.Load()
  if err != nil {
    log.Fatal("Error loading dot env file")
  }

  return &Config {
    EmailUser: os.Getenv("EMAIL_USER"),
    EmailPassword: os.Getenv("EMAIL_PASSWORD"),
    EmailHost: os.Getenv("EMAIL_HOST"),
    EmailPort: os.Getenv("EMAIL_PORT"),
    RecipientEmail: os.Getenv("RECIPIENT_EMAIL"),
  }
}
