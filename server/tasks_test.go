package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/niuguy/gocontrib/models"
	"github.com/niuguy/gocontrib/storage"
)

func TestCreateTask(t *testing.T) {
	// Create a new storage instance
	s := storage.NewStorage()

	// Create a new HTTP request
	reqBody := []byte(`{"name": "Task 1", "description": "This is task 1"}`)
	req, err := http.NewRequest("POST", "/tasks", bytes.NewBuffer(reqBody))
	if err != nil {
		t.Fatal(err)
	}

	// Create a new response recorder
	rr := httptest.NewRecorder()

	// Create a new Gin context
	c, _ := gin.CreateTestContext(rr)
	c.Request = req

	// Call the createTask handler function
	createTask(s)(c)

	// Check the response status code
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, rr.Code)
	}

	// Check the response body
	expectedBody := `{"name": "Task 1", "description": "This is task 1"}`
	if rr.Body.String() != expectedBody {
		t.Errorf("Expected response body %s, but got %s", expectedBody, rr.Body.String())
	}

	// Check if the task was added to the storage
	if len(s.GetTasks()) != 1 {
		t.Errorf("Expected 1 task in storage, but got %d", len(s.GetTasks()))
	}
}
func TestAddTask(t *testing.T) {
	// Create a new storage instance
	s := storage.NewStorage()

	// Create a new task
	task := &models.Task{
		Name:        "Task 1",
		Description: "This is task 1",
	}

	// Add the task to the storage
	err := s.AddTask(task)
	if err != nil {
		t.Fatal(err)
	}

	// Get the tasks from the storage
	tasks := s.GetTasks()

	// Check if the task was added to the storage
	if len(tasks) != 1 {
		t.Errorf("Expected 1 task in storage, but got %d", len(tasks))
	}

	// Check the task details
	if tasks[0].Name != task.Name {
		t.Errorf("Expected task name %s, but got %s", task.Name, tasks[0].Name)
	}
	if tasks[0].Description != task.Description {
		t.Errorf("Expected task description %s, but got %s", task.Description, tasks[0].Description)
	}
}
