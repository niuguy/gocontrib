package github

import (
	"context"
	"github.com/google/go-github/v56/github"
	"gocontrib/pkg/models"
)

//type Issue struct {
//	ID            int64    `json:"id"`
//	URL           string   `json:"url"`
//	Title         string   `json:"title"`
//	CommentsCount int      `json:"comments_count"`
//	IsAssigned    bool     `json:"is_assigned"`
//	Labels        []string `json:"labels"`
//}

func (c *GitHubClient) GetOpenIssuesWithLabels(owner, repo string, labels []string) ([]models.Issue, error) {
	var issues []models.Issue

	ctx := context.Background()
	opt := &github.IssueListByRepoOptions{
		State: "open",
		ListOptions: github.ListOptions{
			PerPage: 100,
		},
	}

	// Filter issues by labels
	if len(labels) > 0 {
		opt.Labels = labels
	}

	// Retrieve issues from the repository
	issueList, _, err := c.client.Issues.ListByRepo(ctx, owner, repo, opt)
	if err != nil {
		return nil, err
	}

	// Populate GitHubIssue struct with issue details
	for _, issue := range issueList {
		var issueLabels string
		for _, label := range issue.Labels {
			issueLabels += label.GetName() + ","
		}
		issues = append(issues, models.Issue{
			GitHubID:      issue.GetID(), // Include the issue ID
			URL:           issue.GetHTMLURL(),
			Title:         issue.GetTitle(),
			CommentsCount: issue.GetComments(),
			IsAssigned:    issue.GetAssignee() != nil,
			Labels:        issueLabels,
		})
	}

	return issues, nil
}
