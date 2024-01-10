package server

import (
	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/models"
	"github.com/niuguy/gocontrib/storage"
)

func BindTasksApi(api *gin.RouterGroup, s *storage.Storage) {
	api.GET("/tasks", getTasks(s))
	api.POST("/tasks", createTask(s))
	api.GET("/tasks/:id", getTask)
	api.PUT("/tasks/:id", updateTask)
	api.DELETE("/tasks/:id", deleteTask)
}

func getTasks(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		tasks, _ := s.RetrieveTasks()
		c.JSON(200, tasks)
	}

}

func createTask(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		//get task body from request
		var task models.Task
		if err := c.ShouldBindJSON(&task); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		s.AddTask(&task)
		c.JSON(200, task)
	}
}

func getTask(c *gin.Context) {
}

func updateTask(c *gin.Context) {
}

func deleteTask(c *gin.Context) {
}
