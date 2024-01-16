package storage

import "github.com/niuguy/gocontrib/models"

func (s *Storage) AddRepo(repo *models.Repository) {
	s.DB.Create(repo)
}

func (s *Storage) RetrieveRepos() ([]models.Repository, error) {
	var repos []models.Repository
	err := s.DB.Find(&repos).Error
	return repos, err
}
