package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Create a new Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Route to serve the static files
	e.Static("/", "static")

	// Start the server on port 8080
	e.Logger.Fatal(e.Start(":8080"))
}
