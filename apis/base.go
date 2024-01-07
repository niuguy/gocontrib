package apis

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pocketbase/pocketbase/core"

	"github.com/niuguy/gocontrib/ui"
)

func Serve() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":1323"))
}

func bindStaticAdminUI(app core.App, e *echo.Echo) error {
	// redirect to trailing slash to ensure that relative urls will still work properly

	// serves static files from the /ui/dist directory
	// (similar to echo.StaticFS but with gzip middleware enabled)
	e.GET(
		echo.StaticDirectoryHandler(ui.DistDirFS, false),
	)

	return nil
}
