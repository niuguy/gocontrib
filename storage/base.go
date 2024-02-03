package storage

import (
	"os"
	"path/filepath"

	"github.com/niuguy/gocontrib/models"
	"gorm.io/driver/sqlite"
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
	err := s.DB.AutoMigrate(&models.Task{}, &models.Repository{})
	if err != nil {
		panic(err)
	}
}

func setupDB(dbDir string) *gorm.DB {
	var dbPath string
	if dbDir == "" {
		var baseDir, dbName string = ".contrib", "contrib.db"
		homeDir, err := os.UserHomeDir()
		if err != nil {
			panic(err)
		}
		baseDir = filepath.Join(homeDir, baseDir)
		if err := os.MkdirAll(baseDir, 0755); err != nil {
			panic(err)
		}
		dbPath = filepath.Join(baseDir, dbName)
	} else {
		dbPath = dbDir
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	return db
}
