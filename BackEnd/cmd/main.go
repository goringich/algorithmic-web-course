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

  contentPath := "../DataBase/Content"
  err = loader.LoadContent(db, contentPath)
  if err != nil {
    log.Fatalf("Ошибка при загрузке контента: %v", err)
  }
  log.Println("Контент успешно загружен в базу данных!")

  contentRepo := repo.NewContentRepository(db)
  contentHandler := httpDelivery.NewContentHandler(contentRepo)

  r := gin.Default()
  httpDelivery.RegisterRoutes(r, contentHandler)

  log.Println("Сервер запущен на http://localhost:8081")
  r.Run(":8081")
}
