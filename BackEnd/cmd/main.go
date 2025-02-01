package main

import (
  "log"

  "BackEnd/pkg/database"
  "BackEnd/internal/loader"
  repo "BackEnd/internal/api/repository"
  httpDelivery "BackEnd/internal/api/delivery/http"

  "github.com/gin-gonic/gin"
)

func main() {
  db, err := database.Connect()
  if err != nil {
    log.Fatalf("Не удалось подключиться к базе данных: %v", err)
  }
  defer db.Close()

  // Проверяем и загружаем контент только при необходимости
  loader.EnsureContentLoaded(db, "../DataBase/Content")

  contentRepo := repo.NewContentRepository(db)
  contentHandler := httpDelivery.NewContentHandler(contentRepo, db) // Передаём db в хендлер

  r := gin.Default()
  httpDelivery.RegisterRoutes(r, contentHandler)

  log.Println("Сервер запущен на http://localhost:8081")
  r.Run(":8081")
}
