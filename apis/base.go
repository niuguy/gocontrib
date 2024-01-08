package apis

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/niuguy/gocontrib/daos"
)

func InitAPIs(dao *daos.Dao) *echo.Echo {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// start the api server
	api := e.Group("/api")
	bindTasksApi(api)
	// start the static file server
	e.Static("/", "ui/dist")

	return e

}
