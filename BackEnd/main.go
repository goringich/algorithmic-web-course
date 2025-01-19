package main

import (
  "backend/config"
  "backend/internal/handlers"
  "backend/internal/models"

  "github.com/gin-gonic/gin"
)

func main() {
  // Инициализация базы данных
  config.InitDB()
  config.DB.AutoMigrate(&models.Item{}) // Создаём таблицу для модели Item

  // Настройка роутера
  r := gin.Default()

  // Маршруты
  r.GET("/items", handlers.GetItems)       // Получить все товары
  r.POST("/items", handlers.CreateItem)    // Создать новый товар
  r.DELETE("/items/:id", handlers.DeleteItem) // Удалить товар

  // Запуск сервера
  r.Run(":8080")
}
