package apis

import "github.com/labstack/echo/v4"

func bindTasksApi(api *echo.Group) {
	api.GET("/tasks", getTasks)
	api.POST("/tasks", createTask)
	api.GET("/tasks/:id", getTask)
	api.PUT("/tasks/:id", updateTask)
	api.DELETE("/tasks/:id", deleteTask)
}

func getTasks(c echo.Context) error {
	return nil
}

func createTask(c echo.Context) error {
	return nil
}

func getTask(c echo.Context) error {
	return nil
}

func updateTask(c echo.Context) error {
	return nil
}

func deleteTask(c echo.Context) error {
	return nil
}
