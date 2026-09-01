package database

import (
  "database/sql"
  "fmt"
  "net"
  "net/url"
  "os"
  "strings"

  _ "github.com/lib/pq"
)

func envOrDefault(name, fallback string) string {
  value := strings.TrimSpace(os.Getenv(name))
  if value == "" {
    return fallback
  }
  return value
}

func Connect() (*sql.DB, error) {
  if dsn := strings.TrimSpace(os.Getenv("DB_DSN")); dsn != "" {
    return sql.Open("postgres", dsn)
  }

  host := envOrDefault("POSTGRES_HOST", "127.0.0.1")
  port := envOrDefault("POSTGRES_PORT", "5432")
  user := envOrDefault("POSTGRES_USER", "postgres")
  password := os.Getenv("POSTGRES_PASSWORD")
  dbName := envOrDefault("POSTGRES_DB", "algo-hack")
  sslMode := envOrDefault("POSTGRES_SSLMODE", "disable")

  if strings.EqualFold(os.Getenv("APP_ENV"), "production") {
    if password == "" {
      return nil, fmt.Errorf("POSTGRES_PASSWORD or DB_DSN is required in production")
    }
    if strings.EqualFold(sslMode, "disable") {
      return nil, fmt.Errorf("POSTGRES_SSLMODE=disable is forbidden in production")
    }
  }

  dsn := &url.URL{
    Scheme: "postgres",
    User: url.User(user),
    Host: net.JoinHostPort(host, port),
    Path: dbName,
  }
  if password != "" {
    dsn.User = url.UserPassword(user, password)
  }
  query := dsn.Query()
  query.Set("sslmode", sslMode)
  dsn.RawQuery = query.Encode()

  return sql.Open("postgres", dsn.String())
}
