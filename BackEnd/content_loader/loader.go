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
  fmt.Println("Starting content loading from:", baseDir) // Debug log
  return filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
    if err != nil {
      return err
    }

    if info.IsDir() && filepath.Dir(path) == baseDir {
      sectionTitle := filepath.Base(path)
      fmt.Println("Adding section:", sectionTitle) // Debug log
      sectionID, err := insertSection(db, sectionTitle)
      if err != nil {
        return fmt.Errorf("failed to insert section: %w", err)
      }

      // Process subdirectories for subsections
      return filepath.Walk(path, func(subPath string, subInfo os.FileInfo, subErr error) error {
        if subErr != nil {
          return subErr
        }

        if subInfo.IsDir() && filepath.Dir(subPath) == path {
          subSectionTitle := filepath.Base(subPath)
          fmt.Println("  Adding subsection:", subSectionTitle) // Debug log
          subSectionID, err := insertSubSection(db, sectionID, subSectionTitle)
          if err != nil {
            return fmt.Errorf("failed to insert subsection: %w", err)
          }

          files, readErr := os.ReadDir(subPath)
          if readErr != nil {
            return fmt.Errorf("failed to read directory: %w", readErr)
          }

          for _, file := range files {
            if file.IsDir() {
              continue // Skip nested directories
            }

            fileType := getFileType(file.Name())
            if fileType != "" {
              filePath := filepath.Join(subPath, file.Name())
              fmt.Println("    Adding file:", file.Name(), "Type:", fileType) // Debug log
              err := insertFile(db, subSectionID, fileType, filePath)
              if err != nil {
                return fmt.Errorf("failed to insert file: %w", err)
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

// Inserts a new section into the database
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
  var id int
  err := db.QueryRow("INSERT INTO SubSections (section_id, title) VALUES ($1, $2) RETURNING id", sectionID, title).Scan(&id)
  if err == nil {
    fmt.Println("Subsection inserted:", title, "ID:", id, "Section ID:", sectionID) // Debug log
  }
  return id, err
}

func insertFile(db *sql.DB, subSectionID int, fileType string, filePath string) error {
  _, err := db.Exec("INSERT INTO Files (subsection_id, file_type, file_path) VALUES ($1, $2, $3)", subSectionID, fileType, filePath)
  if err == nil {
    fmt.Println("File inserted:", filePath, "Type:", fileType, "Subsection ID:", subSectionID) // Debug log
  }
  return err
}


// Determines the file type based on its extension
func getFileType(fileName string) string {
  fmt.Println("Checking file type for:", fileName) // Debug log
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

