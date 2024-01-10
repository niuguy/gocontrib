package storage

import (
	"github.com/niuguy/gocontrib/models"
	"gorm.io/gorm"
)

type Storage struct {
	DB *gorm.DB
}

func NewStorage(dbDir string) *Storage {
	db := setupDB(dbDir)
	return &Storage{DB: db}
}

// AutoMigrate creates database tables if they do not exist.
func (s *Storage) AutoMigrate() {
	err := s.DB.AutoMigrate(&models.Task{})
	if err != nil {
		panic(err)
	}
}
