package content_loader

import (
  "database/sql"
  "fmt"
  "os"
  "path/filepath"
  "strings"
)

func LoadContent(db *sql.DB, baseDir string) error {
  return filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
    if err != nil {
      return err
    }

    // Проверяем, если это директория темы
    if info.IsDir() && filepath.Dir(path) == baseDir {
      sectionTitle := filepath.Base(path)
      sectionID, err := insertSection(db, sectionTitle)
      if err != nil {
        return err
      }

      // Обрабатываем подтемы
      return filepath.Walk(path, func(subPath string, subInfo os.FileInfo, subErr error) error {
        if subErr != nil {
          return subErr
        }

        if subInfo.IsDir() && filepath.Dir(subPath) == path {
          subSectionTitle := filepath.Base(subPath)
          subSectionID, err := insertSubSection(db, sectionID, subSectionTitle)
          if err != nil {
            return err
          }

          // Обрабатываем файлы внутри подтемы
          files, _ := os.ReadDir(subPath)
          for _, file := range files {
            fileType := getFileType(file.Name())
            if fileType != "" {
              filePath := filepath.Join(subPath, file.Name())
              err := insertFile(db, subSectionID, fileType, filePath)
              if err != nil {
                return err
              }
            }
          }
        }

        return nil
      })
    }

    return nil
  })
}

func insertSection(db *sql.DB, title string) (int, error) {
  var id int
  err := db.QueryRow("INSERT INTO Sections (title) VALUES ($1) RETURNING id", title).Scan(&id)
  return id, err
}

func insertSubSection(db *sql.DB, sectionID int, title string) (int, error) {
  var id int
  err := db.QueryRow("INSERT INTO SubSections (section_id, title) VALUES ($1, $2) RETURNING id", sectionID, title).Scan(&id)
  return id, err
}

func insertFile(db *sql.DB, subSectionID int, fileType string, filePath string) error {
  _, err := db.Exec("INSERT INTO Files (subsection_id, file_type, file_path) VALUES ($1, $2, $3)", subSectionID, fileType, filePath)
  return err
}

func getFileType(fileName string) string {
  if strings.HasSuffix(fileName, ".md") {
    return "markdown"
  } else if strings.HasSuffix(fileName, ".docx") {
    if strings.Contains(fileName, "описание") {
      return "word_1"
    } else if strings.Contains(fileName, "пример") {
      return "word_2"
    }
  }
  return ""
}
