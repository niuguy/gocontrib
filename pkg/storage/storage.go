package storage

import (
	"fmt"
	"gocontrib/pkg/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Storage struct {
	DB *gorm.DB
}

// NewStorage initializes and returns a new Storage instance.
func NewStorage() (*Storage, error) {
	db, err := gorm.Open(sqlite.Open("data.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	return &Storage{
		DB: db,
	}, nil
}

// AutoMigrate creates database tables if they do not exist.
func (s *Storage) AutoMigrate() {
	err := s.DB.AutoMigrate(&models.Repository{})
	if err != nil {
		fmt.Print(err)
		return
	}
	err = s.DB.AutoMigrate(&models.Issue{})
	if err != nil {
		fmt.Print(err)
		return
	}
}

// RepositoryExists checks if a repository with the given GitHubID already exists in the database.
func (s *Storage) RepositoryExists(githubID int64) (bool, error) {
	var count int64
	if err := s.DB.Model(&models.Repository{}).Where("github_id = ?", githubID).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// IssueExists checks if an issue with the given GitHubID already exists in the database.
func (s *Storage) IssueExists(githubID int64) (bool, error) {
	var count int64
	if err := s.DB.Model(&models.Issue{}).Where("github_id = ?", githubID).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// StoreRepository stores or updates a repository in the database.
func (s *Storage) StoreRepository(repository *models.Repository) error {
	exists, err := s.RepositoryExists(repository.GitHubID)
	if err != nil {
		return err
	}
	if exists {
		return s.DB.Model(&models.Repository{}).Where("github_id = ?", repository.GitHubID).Updates(repository).Error
	}
	return s.DB.Create(repository).Error
}

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

// RetrieveRepositories retrieves all repositories from the database.
func (s *Storage) RetrieveRepositories() ([]models.Repository, error) {
	var repositories []models.Repository
	return repositories, s.DB.Find(&repositories).Error
}

// RetrieveIssues retrieves issues for a specific repository from the database.
func (s *Storage) RetrieveIssues(repositoryID uint) ([]models.Issue, error) {
	var issues []models.Issue
	if err := s.DB.Where("repo_id = ?", repositoryID).Find(&issues).Error; err != nil {
		return nil, err
	}

	return issues, nil
}
