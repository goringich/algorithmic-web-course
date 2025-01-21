package config

import (
  "log"
  "os"

  "github.com/joho/godotenv"
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
  err := godotenv.Load()
  if err != nil {
    log.Fatalf("Error loading .env file")
  }

  dsn := os.Getenv("DB_DSN")
  db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
  if err != nil {
    log.Fatalf("Failed to connect to database: %v", err)
  }

  DB = db
}
