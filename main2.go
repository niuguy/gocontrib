package main

import (
	"io/fs"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/ui"
)

func main1() {
	dist, _ := fs.Sub(ui.Dist, "dist")

	r := gin.Default()
	r.StaticFS("/", http.FS(dist))
	r.Run(":8080")
}
