package core

import (
	"github.com/niuguy/gocontrib/server"
	"github.com/niuguy/gocontrib/storage"
)

type App struct {
	_server *server.Server
}

func NewApp() *App {
	storage := storage.NewStorage("")
	storage.AutoMigrate()

	s := server.NewServer(storage)

	app := App{
		_server: s,
	}

	return &app
}

func (a *App) Start() {
	a._server.Start()
}
