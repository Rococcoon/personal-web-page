package handlers

import (
  "html/template"
  "log"
  "net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
  tmpl, err := template.ParseFiles(
    "templates/base.html",
    "templates/partials/header.html",
    "templates/pages/home/home.html",
    "templates/pages/home/landing.html",
    "templates/pages/home/about.html",
    "templates/pages/home/projects.html",
    "templates/pages/home/contact.html",
    "templates/pages/home/credits.html",
    "templates/components/contact_form/contact_form_skeleton.html",
    "templates/partials/footer.html",)
  if err != nil {
    log.Printf("Error parsing home.html: %v", err)
    http.Error(w, "Error parsing home.html", http.StatusInternalServerError)
    return
  }

  err = tmpl.ExecuteTemplate(w, "base", nil)
  if err != nil {
    http.Error(w, "Error parsing home.html", http.StatusInternalServerError)
    return
  }
}
