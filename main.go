package main

import (
	"os/exec"

	"github.com/niuguy/gocontrib/core"
)

func main() {
	app := core.NewApp()
	app.Start()
	sleep(10)
	openBrowser("http://localhost:8080")
}

func openBrowser(url string) {
	// var err error

	exec.Command("open", url).Start()
}

// Path: server/server.go
