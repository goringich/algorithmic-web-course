package http

import (
  "net/http"

  "BackEnd/internal/api/repository"
  "github.com/gin-gonic/gin"
)

type ContentHandler struct {
  repo *repository.ContentRepository
}

func NewContentHandler(repo *repository.ContentRepository) *ContentHandler {
  return &ContentHandler{repo: repo}
}

func RegisterRoutes(router *gin.Engine, handler *ContentHandler) {
  router.GET("/api/content", handler.GetContent)
  
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


func (h *ContentHandler) GetContent(c *gin.Context) {
  contents, err := h.repo.GetAllContent()
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, contents)
}
