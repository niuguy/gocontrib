package server

import (
	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/models"
	"github.com/niuguy/gocontrib/storage"
)

func BindRepoApi(api *gin.RouterGroup, s *storage.Storage) {
	api.POST("/repo", createRepo(s))
	api.GET("/repos", getRepos(s))
	api.DELETE("/repo/:owner/:name", deleteRepo(s))
	api.GET("/repo/:owner/:name", getRepo(s))
}

func createRepo(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		//get task body from request
		var repo models.Repository
		if err := c.ShouldBindJSON(&repo); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		s.AddRepo(&repo)
		c.JSON(200, repo)
	}
}

func getRepos(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		repos, _ := s.RetrieveRepos()
		c.JSON(200, repos)
	}

}

func deleteRepo(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		owner := c.Param("owner")
		name := c.Param("name")
		s.DeleteRepoByOwnerAndName(owner, name)
		c.JSON(200, gin.H{"message": "repo deleted"})
	}
}

func getRepo(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		owner := c.Param("owner")
		name := c.Param("name")
		repo, err := s.RetrieveRepoByOwnerAndName(owner, name)
		if err != nil {
			c.JSON(200, nil)
			return
		}
		c.JSON(200, repo)
	}
}
