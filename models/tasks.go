package models

type Task struct {
	// gorm.Model
	// issueId should be a unique key
	ID             uint   `gorm:"primaryKey;column:id" json:"id"`
	IssueID        uint   `gorm:"unique;column:issue_id" json:"issue_id"`
	IssueTitle     string `gorm:"column:issue_title" json:"issue_title"`
	IssueRepoOwner string `gorm:"column:issue_repo_owner" json:"issue_repo_owner"`
	IssueRepoName  string `gorm:"column:issue_repo_name" json:"issue_repo_name"`
	IssueURL       string `gorm:"column:issue_url" json:"issue_url"`
	Status         string `gorm:"column:status" json:"status"`
	Note           string `gorm:"column:note" json:"note"`
}
