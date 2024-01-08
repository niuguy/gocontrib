package daos

import "github.com/niuguy/gocontrib/storage"

type Dao struct {
	storage *storage.Storage
}

func InitDao(dbPath string) *Dao {
	s := storage.NewStorage(dbPath)

	return &Dao{storage: s}
}
