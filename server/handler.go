package server

import (
	"html/template"
	"log"
	"net/http"
)

func Start() {
	http.Handle("/tuner/", http.StripPrefix("/tuner/", http.FileServer(http.Dir("tuner"))))
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	http.HandleFunc("/", HandlePage)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func HandlePage(response http.ResponseWriter, request *http.Request) {
	tmpl := template.Must(template.ParseGlob("templates/index.html"))
	tmpl.Execute(response, nil)
}
