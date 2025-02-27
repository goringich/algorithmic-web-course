package main

import (
  "log"

  "BackEnd/pkg/database"
  "BackEnd/internal/loader"
  repo "BackEnd/internal/api/repository"
  httpDelivery "BackEnd/internal/api/delivery/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-contrib/cors"
)

func main() {
  db, err := database.Connect()
  if err != nil {
    log.Fatalf("Не удалось подключиться к базе данных: %v", err)
  }
  defer db.Close()

  loader.EnsureContentLoaded(db)

  contentRepo := repo.NewContentRepository(db)
  contentHandler := httpDelivery.NewContentHandler(contentRepo, db)

  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:5173"}, // Разрешаем фронтенд
    AllowMethods:     []string{"GET", "POST", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    AllowCredentials: true,
  }))

  httpDelivery.RegisterRoutes(r, contentHandler)

  r.GET("/api/sections", contentHandler.GetSections)

  log.Println("🚀 Сервер запущен на http://localhost:8081")
  r.Run(":8081")
}
