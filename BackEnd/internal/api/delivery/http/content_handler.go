package http

import (
  "net/http"
  "database/sql"
  "BackEnd/internal/api/repository"
  "BackEnd/internal/loader"
  "github.com/gin-gonic/gin"
	"log"
)

type ContentHandler struct {
  repo *repository.ContentRepository
  db   *sql.DB
}

func NewContentHandler(repo *repository.ContentRepository, db *sql.DB) *ContentHandler {
  return &ContentHandler{repo: repo, db: db}
}

func RegisterRoutes(router *gin.Engine, handler *ContentHandler) {
  router.GET("/api/content", handler.GetContent)
  router.POST("/api/clear-db", handler.ClearDB) 

  router.OPTIONS("/api/content", func(c *gin.Context) {
    c.Header("Access-Control-Allow-Origin", "*")
    c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    
    c.JSON(http.StatusOK, gin.H{
      "allowedMethods": "GET, POST, OPTIONS",
      "allowedHeaders": "Content-Type, Authorization",
    })
  })
}


// по вызову через API
func (h *ContentHandler) ClearDB(c *gin.Context) {
  err := loader.ClearDatabase(h.db)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{"message": "База данных очищена"})
}

func (h *ContentHandler) GetContent(c *gin.Context) {
  rows, err := h.db.Query(`
    SELECT f.id, f.title, f.file_path, f.file_type, s.title AS subsection_title, sec.title AS section_title
    FROM Files f
    JOIN SubSections s ON f.subsection_id = s.id
    JOIN Sections sec ON s.section_id = sec.id
  `)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var contents []map[string]interface{}
  for rows.Next() {
    var id int
    var title, filePath, fileType, subsectionTitle, sectionTitle string

    if err := rows.Scan(&id, &title, &filePath, &fileType, &subsectionTitle, &sectionTitle); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }

    contents = append(contents, map[string]interface{}{
      "id":         id,
      "title":      title,       
      "filePath":   filePath,
      "fileType":   fileType,
      "subSection": subsectionTitle,
      "section":    sectionTitle,
    })
  }

  c.JSON(http.StatusOK, contents)
}


func (h *ContentHandler) GetSections(c *gin.Context) {
  rows, err := h.db.Query(`
    SELECT s.id, s.title, 
           COALESCE(json_agg(sub.title) FILTER (WHERE sub.title IS NOT NULL), '[]') AS subSections
    FROM Sections s
    LEFT JOIN SubSections sub ON s.id = sub.section_id
    GROUP BY s.id, s.title
  `)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var sections []map[string]interface{}
  for rows.Next() {
    var id int
    var title string
    var subSections string

    if err := rows.Scan(&id, &title, &subSections); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }

    sections = append(sections, map[string]interface{}{
      "id":          id,
      "title":       title,
      "subSections": subSections,
    })
  }

  log.Println("API отдал разделы:", sections) 
  c.JSON(http.StatusOK, sections)
}



