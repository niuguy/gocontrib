package storage

import (
	"github.com/niuguy/gocontrib/models"
)

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

func (s *Storage) DeleteTask(id int) error {
	return s.DB.Delete(&models.Task{}, id).Error
}
