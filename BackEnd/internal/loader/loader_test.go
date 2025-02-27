package loader

import (
  "database/sql"
  "testing"
)

func TestInsertSection(t *testing.T) {
  db, err := sql.Open("postgres", "user=postgres password=yourpassword dbname=algo-hack sslmode=disable")
  if err != nil {
    t.Fatalf("Ошибка подключения к базе данных: %v", err)
  }
  defer db.Close()

  title := "Test Section"
  id, err := insertSection(db, title)
  if err != nil {
    t.Fatalf("Ошибка при добавлении раздела: %v", err)
  }

  if id == 0 {
    t.Fatalf("Идентификатор раздела не должен быть 0")
  }
}
