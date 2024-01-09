package apis

import (
	"io/fs"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/daos"
	"github.com/niuguy/gocontrib/ui"
)

func InitAPIs(dao *daos.Dao) {
	r := gin.Default()

	dist, _ := fs.Sub(ui.Dist, "dist")
	r.Use(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.URL.Path, "/api") {
			http.FileServer(http.FS(dist)).ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	})

	apiRoute := r.Group("/api")
	bindTasksApi(apiRoute)

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}

}
