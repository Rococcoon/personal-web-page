package utils

import (
  "golang.org/x/net/html"
  "regexp"
  "strings"
)

// cleans user inputs to protect XSS by escaping HTML characters
func SanitizeInput(input string) string {
  input = strings.TrimSpace(input)
  return html.EscapeString(input)
}

// check if the email format is valid
func IsValidEmail(email string) bool {
  re := regexp.MustCompile(`^[a-zA-Z0-9.!#$%&'*+/=?^_`+"`"+`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$`)
  return re.MatchString(email)
}

func IsValidMessage(message string) bool {
  // set minimum and max message length
  return len(message) >= 10 && len(message) <= 256
}
