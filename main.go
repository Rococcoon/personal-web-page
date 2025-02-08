package main

import (
  "log"
  "net/http"

  "github.com/Rococcoon/personal_web_page/config"
  "github.com/Rococcoon/personal_web_page/handlers"
)

func main() {
  cfg := config.LoadConfig()

  // set up serve mux
  mux := http.NewServeMux()

  const staticDir = "static"
  fs := http.FileServer(http.Dir(staticDir))
  mux.Handle("/static/", http.StripPrefix("/static/", fs))

  // set up handlers for serve mux
  mux.HandleFunc("/", handlers.HomeHandler)
  mux.HandleFunc("/style_guide", handlers.StyleGuideHandler)
  mux.HandleFunc("/contact_form_load", handlers.ContactFormLoadHandler)
  mux.HandleFunc("/contact_form_submit", func(w http.ResponseWriter,
                                              r *http.Request) {
      handlers.ContactFormSubmitHandler(w, r, cfg)
    })

  port := "42069"
  log.Printf("Server stating on port: %s", port)
  err := http.ListenAndServe(":"+port, mux)
  if err != nil {
    log.Fatalf("Server failed to start: %v", err)
  }
}
