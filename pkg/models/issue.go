package models

import "gorm.io/gorm"

type Issue struct {
	gorm.Model
	GitHubID      int64  `gorm:"primaryKey;column:github_id" json:"github_id"` // GitHub ID of the issue
	RepoID        uint   `json:"repo_id"`
	URL           string `json:"url"`
	Title         string `json:"title"`
	Language      string `json:"language"`
	CommentsCount int    `json:"comments_count"`
	IsAssigned    bool   `json:"is_assigned"`
	Labels        string `json:"labels"` // Store labels as a comma-separated string
}
