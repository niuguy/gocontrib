package github

import (
	"context"
	"contrib/backend/models"

	"github.com/google/go-github/v56/github"
)

func (c *GitHubClient) GetOpenIssuesWithLabelsAndPagination(owner, repo string, labels []string, pageNum int, perPage int) ([]models.Issue, error) {
	var issues []models.Issue

	ctx := context.Background()
	opt := &github.IssueListByRepoOptions{
		State: "open",
		ListOptions: github.ListOptions{
			Page:    pageNum,
			PerPage: perPage,
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
		//remove the last comma
		if len(issueLabels) > 0 {
			issueLabels = issueLabels[:len(issueLabels)-1]
		}
		issues = append(issues, models.Issue{
			GitHubID:        int64(issue.GetID()), // Include the issue ID
			URL:             issue.GetHTMLURL(),
			Title:           issue.GetTitle(),
			CommentsCount:   issue.GetComments(),
			IsAssigned:      issue.GetAssignee() != nil,
			Labels:          issueLabels,
			Status:          issue.GetState(),
			GitHubCreatedAt: issue.GetCreatedAt().Time,
		})
	}

	return issues, nil
}

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
		var _isGoodFirst bool
		var _isHelpWanted bool
		for _, label := range issue.Labels {
			if label.GetName() == "good first issue" {
				_isGoodFirst = true
			}
			if label.GetName() == "help wanted" {
				_isHelpWanted = true
			}

			issueLabels += label.GetName() + ","
		}
		issues = append(issues, models.Issue{
			GitHubID:        int64(issue.GetID()), // Include the issue ID
			URL:             issue.GetHTMLURL(),
			Title:           issue.GetTitle(),
			CommentsCount:   issue.GetComments(),
			IsAssigned:      issue.GetAssignee() != nil,
			Labels:          issueLabels,
			Status:          issue.GetState(),
			IsGoodFirst:     _isGoodFirst,
			IsHelpWanted:    _isHelpWanted,
			GitHubCreatedAt: issue.GetCreatedAt().Time,
		})
	}

	return issues, nil
}
