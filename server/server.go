package server

import (
	"io/fs"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/storage"
	"github.com/niuguy/gocontrib/ui"
)

type Server struct {
	storage *storage.Storage
	engine  *gin.Engine
}

func NewServer(s *storage.Storage) *Server {

	engine := gin.Default()

	// serve api
	bindApis(engine, s)
	// serve static files
	bindUI(engine)

	_server := Server{storage: s, engine: engine}

	return &_server
}

func bindApis(engine *gin.Engine, s *storage.Storage) {
	apiRoute := engine.Group("/api")
	BindTasksApi(apiRoute, s)
}

func bindUI(engine *gin.Engine) {
	dist, _ := fs.Sub(ui.Dist, "dist")
	engine.Use(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.URL.Path, "/api") {
			http.FileServer(http.FS(dist)).ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	})
}

func (s *Server) Start() {

	if err := s.engine.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
