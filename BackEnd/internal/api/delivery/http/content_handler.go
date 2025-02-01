package http

import (
  "net/http"
  "database/sql"
  "BackEnd/internal/api/repository"
  "BackEnd/internal/loader"
  "github.com/gin-gonic/gin"
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
  router.POST("/api/clear-db", handler.ClearDB) // Добавляем эндпоинт

  // Обработка preflight-запросов
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

// ClearDB удаляет все данные из базы (по вызову через API)
func (h *ContentHandler) ClearDB(c *gin.Context) {
  err := loader.ClearDatabase(h.db)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{"message": "База данных очищена"})
}

// GetContent возвращает список контента
func (h *ContentHandler) GetContent(c *gin.Context) {
  contents, err := h.repo.GetAllContent()
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, contents)
}
