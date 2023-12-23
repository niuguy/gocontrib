package models

import "gorm.io/gorm"

type Repository struct {
	gorm.Model
	GitHubID    uint   `gorm:"primaryKey;column:github_id" json:"github_id"`
	Owner       string `json:"owner"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Stars       int    `json:"stars"`
	OpenIssues  int    `json:"open_issues"`
	Language    string `json:"language"`
	Starred     bool   `json:"starred"`
}
