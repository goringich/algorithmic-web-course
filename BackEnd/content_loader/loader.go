package content_loader

import (
  "database/sql"
  "fmt"
  "os"
  "path/filepath"
  "strings"
  "log"
)

func LoadContent(db *sql.DB, baseDir string) error {
  log.Printf("Checking if base directory exists: %s", baseDir)
  if _, err := os.Stat(baseDir); os.IsNotExist(err) {
    log.Fatalf("Directory does not exist: %s", baseDir)
  }

  entries, err := os.ReadDir(baseDir)
  if err != nil {
    log.Fatalf("Failed to read base directory: %v", err)
  }
  log.Printf("Entries in base directory (%s):", baseDir)
  for _, entry := range entries {
    if entry.IsDir() {
      log.Printf("  [DIR] %s", entry.Name())
    } else {
      log.Printf("  [FILE] %s", entry.Name())
    }
  }

  log.Printf("Starting content loading from: %s", baseDir)

  // Основной обход директорий
  err = filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
    if err != nil {
      log.Printf("Error accessing path %s: %v", path, err)
      return err
    }

    if info.IsDir() && filepath.Dir(path) == baseDir {
      sectionTitle := filepath.Base(path)
      log.Printf("Entering section directory: %s", path)
      log.Printf("Adding section: %s", sectionTitle)
      sectionID, err := insertSection(db, sectionTitle)
      if err != nil {
        log.Printf("Failed to insert section: %v", err)
        return fmt.Errorf("failed to insert section: %w", err)
      }

      subErr := processSubdirectories(db, path, sectionID)
      if subErr != nil {
        log.Printf("Error processing subdirectories for section %s: %v", sectionTitle, subErr)
        return subErr
      }
    }

    return nil
  })

  if err != nil {
    return fmt.Errorf("error walking the base directory: %w", err)
  }

  log.Println("Content loading completed successfully.")
  return nil
}


// Обработка подкаталогов
func processSubdirectories(db *sql.DB, sectionPath string, sectionID int) error {
  return filepath.Walk(sectionPath, func(subPath string, subInfo os.FileInfo, subErr error) error {
    if subErr != nil {
      log.Printf("Error accessing subPath %s: %v", subPath, subErr)
      return subErr
    }

    if subInfo.IsDir() && filepath.Dir(subPath) == sectionPath {
      subSectionTitle := filepath.Base(subPath)
      log.Printf("  Entering subsection directory: %s", subPath)
      log.Printf("  Adding subsection: %s", subSectionTitle)
      subSectionID, err := insertSubSection(db, sectionID, subSectionTitle)
      if err != nil {
        log.Printf("Failed to insert subsection: %v", err)
        return fmt.Errorf("failed to insert subsection: %w", err)
      }

      // Обработка файлов в подкаталоге
      log.Printf("  Reading files in directory: %s", subPath)
      files, readErr := os.ReadDir(subPath)
      if readErr != nil {
        log.Printf("Failed to read directory %s: %v", subPath, readErr)
        return fmt.Errorf("failed to read directory: %w", readErr)
      }

      if len(files) == 0 {
        log.Printf("  No files found in subsection: %s (Path: %s)", subSectionTitle, subPath)
        return nil
      }

      for _, file := range files {
        if file.IsDir() {
          log.Printf("    Skipping nested directory: %s", file.Name())
          continue // Пропускаем вложенные директории
        }

        log.Printf("    Found file: %s", file.Name())
        fileType := getFileType(file.Name())
        if fileType != "" {
          filePath := filepath.Join(subPath, file.Name())
          log.Printf("    Adding file: %s, Type: %s", file.Name(), fileType)
          err := insertFile(db, subSectionID, fileType, filePath)
          if err != nil {
            log.Printf("Failed to insert file: %v", err)
            return fmt.Errorf("failed to insert file: %w", err)
          }
        } else {
          log.Printf("    Skipping unsupported file: %s", file.Name())
        }
      }
    }

    return nil
  })
}



func insertSection(db *sql.DB, title string) (int, error) {
  log.Printf("insertSection: Start, title=%s", title)
  var id int
  err := db.QueryRow("INSERT INTO Sections (title) VALUES ($1) RETURNING id", title).Scan(&id)
  if err != nil {
    log.Printf("insertSection: Error=%v", err)
    return 0, err
  }
  log.Printf("insertSection: Success, id=%d", id)
  return id, nil
}

func insertSubSection(db *sql.DB, sectionID int, title string) (int, error) {
  log.Printf("insertSubSection: Start, title=%s, sectionID=%d", title, sectionID)
  var id int
  err := db.QueryRow("INSERT INTO SubSections (section_id, title) VALUES ($1, $2) RETURNING id", sectionID, title).Scan(&id)
  if err != nil {
    log.Printf("insertSubSection: Error=%v", err)
    return 0, err
  }
  log.Printf("insertSubSection: Success, id=%d", id)
  return id, nil
}

func insertFile(db *sql.DB, subSectionID int, fileType string, filePath string) error {
  log.Printf("insertFile: Start, fileType=%s, filePath=%s, subSectionID=%d", fileType, filePath, subSectionID)
  
  // Выполняем вставку файла в базу данных
  _, err := db.Exec("INSERT INTO Files (subsection_id, file_type, file_path) VALUES ($1, $2, $3)", subSectionID, fileType, filePath)
  if err != nil {
    log.Printf("insertFile: Error inserting file %s (Type: %s, SubSection ID: %d): %v", filePath, fileType, subSectionID, err)
    return err
  }
  
  log.Printf("insertFile: Successfully added file %s (Type: %s, SubSection ID: %d)", filePath, fileType, subSectionID)
  return nil
}


func getFileType(fileName string) string {
  if strings.HasSuffix(fileName, ".md") {
    return "markdown"
  } else if strings.HasSuffix(fileName, ".docx") {
    if strings.Contains(fileName, "описание") {
      return "word_description"
    } else if strings.Contains(fileName, "пример") {
      return "word_example"
    }
    return "word"
  }
  return ""
}
