package main

import (
  "database/sql"
  "encoding/json"
  "log"
  "net/http"

  _ "github.com/lib/pq"
)

type Section struct {
  ID          int    `json:"id"`
  SubsectionID int    `json:"subsection_id"`
  FileType    string `json:"file_type"`
  FilePath    string `json:"file_path"`
}

var db *sql.DB

func connectDB() {
  var err error
  db, err = sql.Open("postgres", "user=postgres password=admin dbname=algo-hack sslmode=disable")
  if err != nil {
    log.Fatalf("Ошибка подключения к базе данных: %v", err)
  }
}


func getSections(w http.ResponseWriter, r *http.Request) {
  rows, err := db.Query("SELECT id, subsection_id, file_type, file_path FROM sections")
  if err != nil {
    http.Error(w, "Ошибка выполнения запроса", http.StatusInternalServerError)
    return
  }
  defer rows.Close()

  var sections []Section
  for rows.Next() {
    var s Section
    if err := rows.Scan(&s.ID, &s.SubsectionID, &s.FileType, &s.FilePath); err != nil {
      http.Error(w, "Ошибка сканирования данных", http.StatusInternalServerError)
      return
    }
    sections = append(sections, s)
  }

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(sections)
}

func main() {
  connectDB()
  defer db.Close()

  http.HandleFunc("/api/sections", getSections)

  log.Println("Сервер запущен на http://localhost:8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}