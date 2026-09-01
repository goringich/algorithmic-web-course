package loader

import (
  "database/sql"
  "os"
  "testing"

  _ "github.com/lib/pq"
)

func TestInsertSection(t *testing.T) {
  dsn := os.Getenv("TEST_DATABASE_DSN")
  if dsn == "" {
    t.Skip("TEST_DATABASE_DSN is not configured; skipping PostgreSQL integration test")
  }

  db, err := sql.Open("postgres", dsn)
  if err != nil {
    t.Fatalf("Ошибка подключения к базе данных: %v", err)
  }
  defer db.Close()

  if err := db.Ping(); err != nil {
    t.Fatalf("PostgreSQL недоступен: %v", err)
  }

  title := "Test Section"
  id, err := insertSection(db, title)
  if err != nil {
    t.Fatalf("Ошибка при добавлении раздела: %v", err)
  }

  if id == 0 {
    t.Fatalf("Идентификатор раздела не должен быть 0")
  }
}
