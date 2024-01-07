package storage

import (
	"contrib/backend/models"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Storage struct {
	DB *gorm.DB
}

// NewStorage initializes and returns a new Storage instance.
func NewStorage() (*Storage, error) {

	homeDir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}

	// Construct the absolute path to the .contrib folder
	contribPath := filepath.Join(homeDir, ".contrib")

	// Create the .contrib folder if it doesn't exist
	if err := os.MkdirAll(contribPath, 0755); err != nil {
		panic(err)
	}

	// Construct the absolute path to the SQLite database file within .contrib
	dbPath := filepath.Join(contribPath, "data.sqlite")

	// Open the SQLite database using GORM
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		// Configuration options here
	})
	if err != nil {
		panic(err)
	}
	return &Storage{
		DB: db,
	}, nil
}

// AutoMigrate creates database tables if they do not exist.
func (s *Storage) AutoMigrate() {
	err := s.DB.AutoMigrate(&models.Repository{}, &models.Issue{}, &models.Task{}, &models.Setting{})
	if err != nil {
		panic(err)
	}
}

// Repository

// RepositoryExists checks if a repository with the given GitHubID already exists in the database.
func (s *Storage) RepositoryExists(githubID uint) (bool, error) {
	var count int64
	if err := s.DB.Model(&models.Repository{}).Where("github_id = ?", githubID).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// StoreOrUpdateRepository stores or updates a repository in the database.
func (s *Storage) StoreOrUpdateRepository(repository *models.Repository) error {
	exists, err := s.RepositoryExists(repository.GitHubID)
	if err != nil {
		return err
	}
	if exists {
		return s.DB.Model(&models.Repository{}).Where("github_id = ?", repository.GitHubID).Updates(repository).Error
	}
	return s.DB.Create(repository).Error
}

// RetrieveRepositories retrieves all repositories from the database.
func (s *Storage) RetrieveRepositories() ([]models.Repository, error) {
	var repositories []models.Repository
	return repositories, s.DB.Find(&repositories).Order("open_issues DESC").Error
}

// Retrieve all languages of repositories
func (s *Storage) RetrieveLanguages() ([]string, error) {
	var languages []string
	return languages, s.DB.Model(&models.Repository{}).Distinct().Pluck("language", &languages).Error
}

// Retrieve repositories by name with pagination
func (s *Storage) RetrieveRepositoriesByName(name string, page, perPage int) ([]models.Repository, error) {
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 10 // Set a default value, e.g., 10 items per page
	}

	var repositories []models.Repository
	offset := (page - 1) * perPage
	if name == "" {
		return repositories, s.DB.Order("open_issues DESC").Offset(offset).Limit(perPage).Find(&repositories).Error
	} else {
		return repositories, s.DB.Order("open_issues DESC").Where("name LIKE ?", "%"+name+"%").Offset(offset).Limit(perPage).Find(&repositories).Error
	}

}

// Retrieve repositories by language with pagination
func (s *Storage) RetrieveRepositoriesByLanguage(language string, page, perPage int) ([]models.Repository, error) {
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 10 // Set a default value, e.g., 10 items per page
	}

	var repositories []models.Repository
	offset := (page - 1) * perPage
	return repositories, s.DB.Order("open_issues DESC").Where("language = ?", language).Offset(offset).Limit(perPage).Find(&repositories).Error
}

// Retrieve the total number of repositories
func (s *Storage) GetTotalRepositoryCount() (int64, error) {
	var count int64
	return count, s.DB.Model(&models.Repository{}).Count(&count).Error
}

// Issue

// StoreIssue stores or updates an issue in the database.
func (s *Storage) StoreIssue(issue *models.Issue) error {
	exists, err := s.IssueExists(issue.GitHubID)
	if err != nil {
		return err
	}
	if exists {
		return s.DB.Model(&models.Issue{}).Where("github_id = ?", issue.GitHubID).Updates(issue).Error
	}
	return s.DB.Create(issue).Error
}

// IssueExists checks if an issue with the given GitHubID already exists in the database.
func (s *Storage) IssueExists(githubID int64) (bool, error) {
	var count int64
	if err := s.DB.Model(&models.Issue{}).Where("github_id = ?", githubID).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// update the issue status
func (s *Storage) UpdateIssue(issue *models.Issue) error {
	return s.DB.Model(&models.Issue{}).Where("github_id = ?", issue.GitHubID).Updates(issue).Error
}

func (s *Storage) RetrieveIssuesByRepo(owner string, name string) ([]models.Issue, error) {
	var issues []models.Issue
	return issues, s.DB.Where("owner = ? AND name = ?", owner, name).Find(&issues).Error
}

func (s *Storage) RetrieveIssuesByRepoId(id int64) ([]models.Issue, error) {
	var issues []models.Issue
	return issues, s.DB.Where("repo_id = ?", id).Find(&issues).Error
}

// Tasks

// Add tasks to the database
func (s *Storage) AddTask(task *models.Task) error {
	return s.DB.Create(task).Error
}

// Check if a task on the issue exists
func (s *Storage) TaskExists(issueId uint) (bool, error) {
	var count int64
	if err := s.DB.Model(&models.Task{}).Where("issue_id = ?", issueId).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// Update the task on the issue
func (s *Storage) UpdateTask(task *models.Task) error {
	return s.DB.Model(&models.Task{}).Where("id = ?", task.ID).Updates(task).Error
}

func (s *Storage) RetrieveTasks() ([]models.Task, error) {
	var tasks []models.Task
	err := s.DB.Order(`
        CASE 
            WHEN status = 'TODO' THEN 1
            WHEN status = 'DOING' THEN 2
            WHEN status = 'DONE' THEN 3
            ELSE 4
        END`).Find(&tasks).Error
	return tasks, err
}

// Get a setting by key
func (s *Storage) GetSettingValueByKey(key string) (string, error) {
	var setting models.Setting
	err := s.DB.Where("key = ?", key).First(&setting).Error
	return setting.Val, err
}

// Add a setting to the database
func (s *Storage) AddSetting(setting *models.Setting) error {
	return s.DB.Create(setting).Error
}

// If the setting exists
func (s *Storage) SettingExists() (bool, error) {
	var count int64
	if err := s.DB.Model(&models.Setting{}).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// Update the setting
func (s *Storage) UpdateSetting(setting *models.Setting) error {
	return s.DB.Model(&models.Setting{}).Where("key = ?", setting.Key).Updates(setting).Error
}
