package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/niuguy/gocontrib/models"
	"github.com/niuguy/gocontrib/storage"
	"github.com/stretchr/testify/assert"
)

var _task = models.Task{
	IssueID:        1,
	IssueTitle:     "Test Issue",
	IssueRepoOwner: "owner",
	IssueRepoName:  "repo",
	IssueURL:       "http://example.com",
	Status:         "open",
	Note:           "Test note",
}

var issueIDCounter uint = 1

func _createTask(s *Server) *httptest.ResponseRecorder {
	task := _task
	task.IssueID = issueIDCounter
	issueIDCounter++ // Increment for the next task

	taskJSON, _ := json.Marshal(task)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/tasks", bytes.NewBuffer(taskJSON))
	req.Header.Set("Content-Type", "application/json")
	s.engine.ServeHTTP(w, req)

	return w
}

func TestTasksApi(t *testing.T) {
	// Set up
	dbPath := "file::memory:?cache=shared"
	storage := storage.NewStorage(dbPath)
	storage.AutoMigrate()
	s := NewServer(storage)

	tests := []struct {
		name           string
		method         string
		endpoint       string
		setupFunc      func() *models.Task
		modifyFunc     func(*models.Task)
		cleanupFunc    func()
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Test ping",
			method:         "GET",
			endpoint:       "/api/ping",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Test task create",
			method:         "POST",
			endpoint:       "/api/tasks",
			setupFunc:      func() *models.Task { return &_task },
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Test task get",
			method:         "GET",
			endpoint:       "/api/tasks",
			setupFunc:      func() *models.Task { _createTask(s); return nil },
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Test task update",
			method:         "PUT",
			endpoint:       "/api/tasks/1",
			setupFunc:      func() *models.Task { _createTask(s); return &_task },
			modifyFunc:     func(t *models.Task) { t.Status = "closed" },
			expectedStatus: http.StatusOK,
			expectedBody:   `{"id":0,"issue_id":1,"issue_title":"Test Issue","issue_repo_owner":"owner","issue_repo_name":"repo","issue_url":"http://example.com","status":"closed","note":"Test note"}`,
		},
		{
			name:           "Test task delete",
			method:         "DELETE",
			endpoint:       "/api/tasks/1",
			setupFunc:      func() *models.Task { _createTask(s); return nil },
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var req *http.Request
			var err error

			var task *models.Task
			if tt.setupFunc != nil {
				task = tt.setupFunc()
			}

			if tt.modifyFunc != nil && task != nil {
				tt.modifyFunc(task)
			}

			if task != nil {
				bodyJSON, _ := json.Marshal(task)
				req, err = http.NewRequest(tt.method, tt.endpoint, bytes.NewBuffer(bodyJSON))
				req.Header.Set("Content-Type", "application/json")
			} else {
				req, err = http.NewRequest(tt.method, tt.endpoint, nil)
			}

			if err != nil {
				t.Fatal(err)
			}

			w := httptest.NewRecorder()
			s.engine.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}
		})
	}
}

var _repo = models.Repository{
	GitHubID:         1,
	Owner:            "testOwner",
	Name:             "testRepo",
	Description:      "This is a test repository",
	Stars:            42,
	OpenIssues:       10,
	HelpWantedIssues: 5,
	Language:         "Go",
	Starred:          false,
}

func _createRepo(s *Server) *httptest.ResponseRecorder {
	repo := _repo

	repoJSON, _ := json.Marshal(repo)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/repo", bytes.NewBuffer(repoJSON))
	req.Header.Set("Content-Type", "application/json")
	s.engine.ServeHTTP(w, req)

	return w
}

func TestRepoApi(t *testing.T) {
	// Set up
	dbPath := "file::memory:?cache=shared"
	storage := storage.NewStorage(dbPath)
	storage.AutoMigrate()
	s := NewServer(storage)

	tests := []struct {
		name           string
		method         string
		endpoint       string
		setupFunc      func() *models.Repository
		modifyFunc     func(*models.Repository)
		cleanupFunc    func()
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Test repo create",
			method:         "POST",
			endpoint:       "/api/repo",
			setupFunc:      func() *models.Repository { return &_repo },
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Test repo get",
			method:         "GET",
			endpoint:       "/api/repo/testOwner/testRepo",
			setupFunc:      func() *models.Repository { _createRepo(s); return nil },
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Test repo get",
			method:         "GET",
			endpoint:       "/api/repos",
			setupFunc:      func() *models.Repository { _createRepo(s); return nil },
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Test repo delete",
			method:         "DELETE",
			endpoint:       "/api/repo/testOwner/testRepo",
			setupFunc:      func() *models.Repository { _createRepo(s); return nil },
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var req *http.Request
			var err error

			var repo *models.Repository
			if tt.setupFunc != nil {
				repo = tt.setupFunc()
			}

			if tt.modifyFunc != nil && repo != nil {
				tt.modifyFunc(repo)
			}

			if repo != nil {
				bodyJSON, _ := json.Marshal(repo)
				req, err = http.NewRequest(tt.method, tt.endpoint, bytes.NewBuffer(bodyJSON))
				req.Header.Set("Content-Type", "application/json")
			} else {
				req, err = http.NewRequest(tt.method, tt.endpoint, nil)
			}

			if err != nil {
				t.Fatal(err)
			}

			w := httptest.NewRecorder()
			s.engine.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			if tt.expectedBody != "" {
				assert.JSONEq(t, tt.expectedBody, w.Body.String())
			}
		})
	}
}
