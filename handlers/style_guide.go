package handlers

import (
  "fmt"
  "html/template"
  "net/http"
)

func StyleGuideHandler(w http.ResponseWriter, r *http.Request) {
  tmpl, err := template.ParseFiles(
    "templates/base.html",
    "templates/partials/header.html",
    "templates/pages/style_guide/index.html",
    "templates/components/contact_form/contact_form_skeleton.html",
    "templates/partials/footer.html",)
  if err != nil {
    http.Error(w, "Error parsing temp.html", http.StatusInternalServerError)
    return
  }

  err = tmpl.ExecuteTemplate(w, "base", nil)
  if err != nil {
    fmt.Printf("temp.html executing error: %v", err)
    http.Error(w, "Error executing temp.html", http.StatusInternalServerError)
    return
  }
}
