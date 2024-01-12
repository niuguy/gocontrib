package server

import (
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
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

	ghClient := NewGitHubClient(os.Getenv("GITHUB_TOKEN"))

	// serve api
	apiRoute := engine.Group("/api")
	BindTasksApi(apiRoute, s)
	BindGithubApi(apiRoute, ghClient)

	// serve static files
	bindUI(engine)

	_server := Server{storage: s, engine: engine}

	return &_server
}

func bindUI(engine *gin.Engine) {
	dist, _ := fs.Sub(ui.Dist, "dist")
	fileServer := http.FileServer(http.FS(dist))

	engine.Use(func(c *gin.Context) {
		fmt.Println("Request URL:", c.Request.URL.Path)

		if !strings.HasPrefix(c.Request.URL.Path, "/api") {
			// Check if the requested file exists
			_, err := fs.Stat(dist, strings.TrimPrefix(c.Request.URL.Path, "/"))
			if os.IsNotExist(err) {
				// If the file does not exist, serve index.html
				fmt.Println("File not found, serving index.html")
				c.Request.URL.Path = "/"
			} else {
				// Serve other static files
				fmt.Println("Serving other static files")
			}

			fileServer.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	})
}

func (s *Server) Start() {

	if err := s.engine.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
