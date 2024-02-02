package storage

import (
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupDB(dbDir string) *gorm.DB {
	var baseDir, dbName string = ".contrib", "contrib.db"
	if dbDir == "" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			panic(err)
		}
		baseDir = filepath.Join(homeDir, baseDir)
	} else {
		baseDir = dbDir
	}
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		panic(err)
	}
	dbPath := filepath.Join(baseDir, dbName)
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	return db
}
