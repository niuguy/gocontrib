package main

import (
	"os/exec"

	"github.com/niuguy/gocontrib/core"
)

func main() {
	app := core.NewApp()
	app.Start()
	openBrowser("http://localhost:8080")
}

func openBrowser(url string) {
	exec.Command("open", url).Start()
}
