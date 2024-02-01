package storage

import (
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupDB(dbDir string) *gorm.DB {

	// If no dbDir is specified, use the default
	var _dbDir string
	_dbDir = dbDir
	if _dbDir == "" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			panic(err)
		}

		// Construct the absolute path to the .contrib folder
		_dbDir = filepath.Join(homeDir, ".contrib/contrib.sqlite")

		// Create the .contrib folder if it doesn't exist
		if err := os.MkdirAll(_dbDir, 0755); err != nil {
			panic(err)
		}
	}

	// Construct the absolute path to the SQLite database file within .contrib
	dbPath := filepath.Join(_dbDir)
	db, err := gorm.Open(sqlite.Open(dbPath))
	if err != nil {
		panic(err)
	}

	return db
}
