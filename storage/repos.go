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

func (s *Storage) RetrieveRepoByOwnerAndName(owner string, name string) (*models.Repository, error) {
	var repo models.Repository
	err := s.DB.First(&repo, "owner = ? AND name = ?", owner, name).Error
	return &repo, err
}
	
func (s *Storage) DeleteRepoByOwnerAndName(owner string, name string) {
	s.DB.Where("owner = ? AND name = ?", owner, name).Delete(&models.Repository{})
}
