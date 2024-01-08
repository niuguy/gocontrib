package cmd

import (
	"github.com/niuguy/gocontrib/apis"
	"github.com/niuguy/gocontrib/daemon"
	"github.com/niuguy/gocontrib/daos"
)

type App struct {
	dbPath string
}

func NewApp() *App {
	return &App{}
}

func (a *App) Start() {
	// Init config

	// Init DB connection

	dao := daos.InitDao(".")

	api := apis.InitAPIs(dao)

	api.Start(":1323")

	api.Static("/", "ui/dist")

	daemon.Start()

	// Start api server

	// Start daemon

	// daemon.Start()
}
