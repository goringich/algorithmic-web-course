package database

import (
  "database/sql"
  _ "github.com/lib/pq" // PostgreSQL драйвер
)

func Connect() (*sql.DB, error) {
  connStr := "user=postgres password=admin dbname=algo-hack sslmode=disable"
  return sql.Open("postgres", connStr)
}
