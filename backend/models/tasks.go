package models

type Task struct {
	// gorm.Model
	// issueId should be a unique key
	ID             uint   `gorm:"primaryKey;column:id" json:"id"`
	IssueID        uint   `gorm:"unique;column:issue_id" json:"issue_id"`
	IssueTitle     string `json:"issue_title"`
	IssueRepoOwner string `json:"issue_repo_owner"`
	IssueRepoName  string `json:"issue_repo_name"`
	IssueURL       string `json:"issue_url"`
	Status         string `json:"status"`
	Note           string `json:"note"`
}
