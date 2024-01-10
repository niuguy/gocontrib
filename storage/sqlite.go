package storage

import (
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupDB(dbDir string) *gorm.DB {

	if dbDir == "" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			panic(err)
		}

		// Construct the absolute path to the .contrib folder
		dbDir := filepath.Join(homeDir, ".contrib")

		// Create the .contrib folder if it doesn't exist
		if err := os.MkdirAll(dbDir, 0755); err != nil {
			panic(err)
		}
	}

	// Construct the absolute path to the SQLite database file within .contrib
	dbPath := filepath.Join(dbDir, "gocontrib.sqlite")
	db, err := gorm.Open(sqlite.Open(dbPath))
	if err != nil {
		panic(err)
	}
	return db
}
