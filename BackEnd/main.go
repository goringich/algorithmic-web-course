package main

import (
  "log"

  "BackEnd/content_loader"
  "BackEnd/database"
)

func main() {
  db, err := database.Connect()
  if err != nil {
    log.Fatalf("Не удалось подключиться к базе данных: %v", err)
  } else {
    log.Println("Успешное подключение к базе данных!")
  }
  defer db.Close()

  contentPath := "../DataBase/Content"
  err = content_loader.LoadContent(db, contentPath)
  if err != nil {
    log.Fatalf("Ошибка при загрузке контента: %v", err)
  }

  log.Println("Контент успешно загружен в базу данных!")
}