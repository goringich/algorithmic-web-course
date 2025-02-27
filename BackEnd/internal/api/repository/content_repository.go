package repository

import (
  "database/sql"
)

type Content struct {
  ID       int    `json:"id"`
  FilePath string `json:"filePath"`
  Title    string `json:"fileType"`
}

type ContentRepository struct {
  db *sql.DB
}

func NewContentRepository(db *sql.DB) *ContentRepository {
  return &ContentRepository{db: db}
}

func (r *ContentRepository) GetAllContent() ([]Content, error) {
  rows, err := r.db.Query("SELECT id, file_path, file_type FROM files")
  if err != nil {
    return nil, err
  }
  defer rows.Close()

  var contents []Content
  for rows.Next() {
    var c Content
    if err := rows.Scan(&c.ID, &c.FilePath, &c.Title); err != nil {
      return nil, err
    }
    contents = append(contents, c)
  }
  return contents, nil
}
