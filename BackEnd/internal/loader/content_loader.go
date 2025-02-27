package loader

import (
  "database/sql"
  "log"
)

type SectionTitle struct {
  Title       string
  SubSections map[string][]string 
}

var sectionsData = []SectionTitle{
  {
    Title: "Структуры данных и алгоритмы обработки диапазонов",
    SubSections: map[string][]string{
      "Дерево отрезков (ДО)": {
        "Обзор дерева отрезков",
        "Применение в алгоритмах",
      },
      "Дерево Фенвик": {
        "Основные операции",
        "Ускоренные вычисления",
      },
    },
  },
  {Title: "Алгоритмы обработки координат и анализа пространственных данных", SubSections: map[string][]string{}},
  {Title: "Декомпозиционные методы", SubSections: map[string][]string{}},
  {Title: "Методы поиска и преобразований", SubSections: map[string][]string{}},
  {Title: "Алгоритмы потоков в сетях", SubSections: map[string][]string{}},
  {Title: "Геометрические алгоритмы", SubSections: map[string][]string{}},
}

// EnsureContentLoaded загружает темы, если они ещё не добавлены
func EnsureContentLoaded(db *sql.DB) {
  var count int
  err := db.QueryRow("SELECT COUNT(*) FROM Sections").Scan(&count)
  if err != nil {
    log.Fatalf("Ошибка при проверке базы: %v", err)
  }

  if count > 0 {
    log.Println("Темы уже загружены, пропускаем.")
    return
  }

  log.Println("Загружаем темы в базу...")
  for _, section := range sectionsData {
    var sectionID int
    err = db.QueryRow("INSERT INTO Sections (title) VALUES ($1) RETURNING id", section.Title).Scan(&sectionID)
    if err != nil {
      log.Fatalf("Ошибка при добавлении темы: %v", err)
    }

    for _, sub := range section.SubSections {
      _, err = db.Exec("INSERT INTO SubSections (section_id, title) VALUES ($1, $2)", sectionID, sub)
      if err != nil {
        log.Fatalf("Ошибка при добавлении подраздела: %v", err)
      }
    }
  }

  log.Println("Темы успешно загружены!")
}




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
