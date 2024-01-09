package apis

import (
	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/models"
)

func bindTasksApi(api *gin.RouterGroup) {
	api.GET("/tasks", getTasks)
	api.POST("/tasks", createTask)
	api.GET("/tasks/:id", getTask)
	api.PUT("/tasks/:id", updateTask)
	api.DELETE("/tasks/:id", deleteTask)
}

func getTasks(c *gin.Context) {
	task := models.Task{
		IssueID:        1,
		IssueTitle:     "Sample Issue",
		IssueRepoOwner: "user",
		IssueRepoName:  "repo",
		IssueURL:       "https://github.com/user/repo/issues/1",
		Status:         "Open",
		Note:           "This is a sample note",
	}
	tasks := []models.Task{task}
	c.JSON(200, tasks)

}

func createTask(c *gin.Context) {
}

func getTask(c *gin.Context) {
}

func updateTask(c *gin.Context) {
}

func deleteTask(c *gin.Context) {
}
