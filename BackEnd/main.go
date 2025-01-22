package main

import (
  "log"

  "your_project_path/back/content_loader" // Обновите на ваш путь
  "your_project_path/back/database"      // Обновите на ваш путь
)

func main() {
  // Подключение к базе данных
  db, err := database.Connect()
  if err != nil {
    log.Fatalf("Не удалось подключиться к базе данных: %v", err)
  }
  defer db.Close()

  // Загрузка контента из папки DataBase/content
  contentPath := "DataBase/content" // Убедитесь, что путь указан правильно
  err = content_loader.LoadContent(db, contentPath)
  if err != nil {
    log.Fatalf("Ошибка при загрузке контента: %v", err)
  }

  log.Println("Контент успешно загружен в базу данных!")
}
