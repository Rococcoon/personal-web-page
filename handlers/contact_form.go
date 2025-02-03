package handlers

import (
  "fmt"
  "html/template"
  "log"
  "net/http"
  "strconv"
  "time"

  "github.com/Rococcoon/personal_web_page/config"
  "github.com/Rococcoon/personal_web_page/utils"
  "gopkg.in/gomail.v2"
)

// use int to declare amount of requests allowed per minute
var rateLimiter = utils.NewRateLimiter(5, time.Minute)

func ContactFormLoadHandler(w http.ResponseWriter, r *http.Request) {
  tmpl, err := template.ParseFiles("templates/components/contact_form/contact_form.html")
  if err != nil {
    http.Error(w, "Error parsing contact_form.html", http.StatusInternalServerError)
    return
  }

  err = tmpl.ExecuteTemplate(w, "contact_form", nil); if err != nil {
    http.Error(w, "Error executing contact_form.html", http.StatusInternalServerError)
    return
  }
}

func ContactFormSubmitHandler(w http.ResponseWriter, r *http.Request, cfg *config.Config) {
  if r.Method != http.MethodPost {
    http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
    return
  }

  // check if the request exceeds the rate limit
  if !rateLimiter.AllowRequest(r) {
    http.Error(w, "too many request, please try again later", http.StatusTooManyRequests)
  }

  err := r.ParseMultipartForm(10 << 20) // 10 MB limit
  if err != nil {
    http.Error(w, "Error parsing form data", http.StatusBadRequest)
    log.Println("Error parsin form:", err)
    return
  }

  email := utils.SanitizeInput(r.FormValue("email"))
  message := utils.SanitizeInput(r.FormValue("message"))
  name := utils.SanitizeInput(r.FormValue("name"))

  // validate inputs
  if !utils.IsValidEmail(email) {
    http.Error(w, "invalid email address", http.StatusBadRequest)
    return
  }

  if !utils.IsValidMessage(message) {
    http.Error(w, "invalid message length", http.StatusBadRequest)
    return
  }

  if name == "" {
    http.Error(w, "name cannot be empty", http.StatusBadRequest)
    return
  }

  // Process the data
  err = sendContactEmail(email, message, name, cfg)
  if err != nil {
    http.Error(w, "Error sending email", http.StatusInternalServerError)
    log.Println("Error sending email:", err)
    return
  }

  // response with new form
  tmpl, err := template.ParseFiles("templates/components/contact_form/contact_form_success.html")
  if err != nil {
    http.Error(w, "Error parsing contact_form_success.html", http.StatusInternalServerError)
    return
  }

  // Send a success response
  w.Header().Set("Content-type", "text/html")
  w.WriteHeader(http.StatusOK)

  err = tmpl.ExecuteTemplate(w, "contact_form", nil); if err != nil {
    http.Error(w, "Error executing contact_form.html", http.StatusInternalServerError)
    return
  }
}

func sendContactEmail(email, message, name string, cfg *config.Config) error {

  emailPortInt, err := strconv.Atoi(cfg.EmailPort)
  if err != nil {
    return fmt.Errorf("invalid email port: %w", err)
  }

  m := gomail.NewMessage()
  m.SetHeader("From", cfg.EmailUser)
  m.SetHeader("To", cfg.RecipientEmail)
  m.SetHeader("Subject", "New Contact Form Submission")
  m.SetBody("text/plain", fmt.Sprintf(
    "Name: %s\nEmail: %s\nMessage: %s", name, email, message))

  d := gomail.NewDialer(cfg.EmailHost, emailPortInt, cfg.EmailUser, cfg.EmailPassword)
  d.SSL = false

  if err := d.DialAndSend(m); err != nil {
    fmt.Printf("error sending email: %v", err)
    return fmt.Errorf("error sending email: %w", err)
  }

  log.Printf("Email sent to %s", cfg.RecipientEmail)
  return nil
}
