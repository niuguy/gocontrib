package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
)

func Start() {
	// Initialize the router
	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler)

	// Start the HTTP server in a goroutine
	go func() {
		fmt.Println("Starting HTTP server on :8080")
		if err := http.ListenAndServe(":8080", r); err != nil {
			log.Fatal("ListenAndServe:", err)
		}
	}()

	// Start the scheduler in a goroutine
	go func() {
		ticker := time.NewTicker(1 * time.Minute)
		for {
			select {
			case <-ticker.C:
				// Task to be scheduled
				fmt.Println("Scheduled task executed", time.Now())
			}
		}
	}()

	// Handle graceful shutdown
	gracefulShutdown()
}

// HomeHandler handles HTTP requests at the root
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(w, "Welcome to the HTTP server!")
}

// gracefulShutdown handles graceful shutdown of the server
func gracefulShutdown() {
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)
	<-stopChan

	// Perform shutdown procedures if needed
	fmt.Println("Shutting down gracefully...")
	os.Exit(0)
}
