package handlers

import (
  "backend/config"
  "backend/internal/models"
  "net/http"

  "github.com/gin-gonic/gin"
)

func GetItems(c *gin.Context) {
  var items []models.Item
  config.DB.Find(&items)
  c.JSON(http.StatusOK, items)
}

func CreateItem(c *gin.Context) {
  var item models.Item
  if err := c.ShouldBindJSON(&item); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }
  config.DB.Create(&item)
  c.JSON(http.StatusOK, item)
}

func DeleteItem(c *gin.Context) {
  id := c.Param("id")
  config.DB.Delete(&models.Item{}, id)
  c.Status(http.StatusNoContent)
}
