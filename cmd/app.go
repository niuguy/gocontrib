package cmd

import (
	"github.com/niuguy/gocontrib/apis"
	"github.com/niuguy/gocontrib/daemon"
)

type App struct {
}

func NewApp() *App {
	return &App{}
}

func (a *App) Start() {
	// Init config

	// Init DB connection

	// Start api server

	// Start daemon

	apis.Serve()
	daemon.Start()
}
