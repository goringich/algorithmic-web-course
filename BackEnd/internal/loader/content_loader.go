package loader

import (
  "database/sql"
  "log"
)

// EnsureContentLoaded проверяет, есть ли данные в таблице Files, и загружает контент, если она пуста.
func EnsureContentLoaded(db *sql.DB, contentPath string) {
  var count int
  err := db.QueryRow("SELECT COUNT(*) FROM Files").Scan(&count)
  if err != nil {
    log.Fatalf("Ошибка при проверке базы данных: %v", err)
  }

  if count == 0 {
    log.Println("Таблица Files пуста. Загружаем контент...")
    err = LoadContent(db, contentPath)
    if err != nil {
      log.Fatalf("Ошибка при загрузке контента: %v", err)
    }
    log.Println("Контент успешно загружен в базу данных!")
  } else {
    log.Println("Контент уже загружен. Пропускаем загрузку.")
  }
}

// ClearDatabase удаляет все данные из таблиц (по вызову)
func ClearDatabase(db *sql.DB) error {
  log.Println("Очищаем базу данных...")

  _, err := db.Exec("TRUNCATE TABLE Files RESTART IDENTITY CASCADE")
  if err != nil {
    return err
  }

  _, err = db.Exec("TRUNCATE TABLE SubSections RESTART IDENTITY CASCADE")
  if err != nil {
    return err
  }

  _, err = db.Exec("TRUNCATE TABLE Sections RESTART IDENTITY CASCADE")
  if err != nil {
    return err
  }

  log.Println("База данных успешно очищена.")
  return nil
}
