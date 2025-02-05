package handlers

import (
  "html/template"
  "net/http"
)

func HamburgerHandler(w http.ResponseWriter, r *http.Request) {
  tmpl, err := template.ParseFiles()
  if err != nil {
    http.Error(w, "Error parsing hamburger.html", http.StatusInternalServerError)
    return
  }

  err = tmpl.ExecuteTemplate(w, "hamburger", nil)
  if err != nil {
    http.Error(w, "Error parsing hamburger.html", http.StatusInternalServerError)
    return
  }
}
