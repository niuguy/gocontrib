package github

import (
	"fmt"
	"os"
	"testing"
)

func TestGitHubClient_GetRepositoriesWithPagination(t *testing.T) {
	accessToken := os.Getenv("GITHUB_TOKEN")
	client := NewGitHubClient(accessToken)

	t.Run("Successful Fetch", func(t *testing.T) {
		// Call the method with a test language parameter and maxCount.
		maxCount := 5
		repositories, err := client.GetRepositoriesWithPagination(maxCount, "go")

		// Check for errors.
		if err != nil {
			t.Errorf("Error: %v", err)
		}

		// Check if the method correctly fetched repositories.
		if len(repositories) != maxCount {
			t.Errorf("Expected %d repositories, but got %d", maxCount, len(repositories))
		}

		// Output repository details.
		for _, repo := range repositories {
			fmt.Printf("GitHubID: %d, Owner: %s, Name: %s, Description: %s, Language: %s, Stars: %d\n", repo.GitHubID, repo.Owner, repo.Name, repo.Description, repo.Language, repo.Stars)
		}
	})
}
