package github

import (
	"fmt"
	"os"
	"testing"
)

func TestGitHubClient_GetOpenIssuesWithLabels(t *testing.T) {
	accessToken := os.Getenv("GITHUB_TOKEN")
	client := NewGitHubClient(accessToken)

	// Replace with the owner, repo, and labels you want to test
	owner := "grafana"
	repo := "loki"
	labels := []string{"good first issue"}

	issues, err := client.GetOpenIssuesWithLabels(owner, repo, labels)

	// Check for errors.
	if err != nil {
		t.Errorf("Error: %v", err)
	}

	// Output issue details.
	for _, issue := range issues {
		fmt.Printf("GitHubID: %d, URL: %s, Title: %s, CommentsCount: %d, IsAssigned: %v, Labels: %v\n",
			issue.GitHubID, issue.URL, issue.Title, issue.CommentsCount, issue.IsAssigned, issue.Labels)
	}
}
