package server

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/models"
	"github.com/niuguy/gocontrib/storage"
)

func BindTasksApi(api *gin.RouterGroup, s *storage.Storage) {
	api.GET("/tasks", getTasks(s))
	api.POST("/tasks", createTask(s))
	api.PUT("/tasks/:id", updateTask(s))
	api.DELETE("/tasks/:id", deleteTask(s))
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

func updateTask(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		//get task body from request
		var task models.Task
		if err := c.ShouldBindJSON(&task); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		s.UpdateTask(&task)
		c.JSON(200, task)
	}
}

func deleteTask(s *storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		id_num, _ := strconv.Atoi(id)

		err := s.DeleteTask(id_num)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Task deleted successfully"})
	}
}
