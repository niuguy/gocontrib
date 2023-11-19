package scheduler

import (
	"fmt"
	"gocontrib/pkg/github"
	"gocontrib/pkg/storage"
	"os"
)

func updateTopRepoGoodFirstIssues() {
	// Initialize a storage instance
	db, err := storage.NewStorage()
	if err != nil {
		fmt.Println("Error initializing storage:", err)
		return
	}

	// Auto-migrate the database tables if needed
	db.AutoMigrate()

	// Initialize a GitHub API client
	ghClient := github.NewGitHubClient(os.Getenv("GITHUB_TOKEN"))

	// Define the languages to filter by
	languages := []string{"javascript", "python", "go"}

	// Fetch the top 100 starred repositories for each language
	for _, language := range languages {
		// Use the GetRepositoriesWithPagination method to retrieve repositories
		repos, err := ghClient.GetRepositoriesWithPagination(100, []string{language}...)
		if err != nil {
			fmt.Printf("Error fetching %s repos: %v\n", language, err)
			continue
		}

		for _, repo := range repos {
			// Store or update the repository in the database
			if err := db.StoreRepository(&repo); err != nil {
				fmt.Printf("Error storing repo %s: %v\n", repo.Name, err)
				continue
			}

			// Fetch "good first issue" labeled issues for the repository
			// Use the GetGoodFirstIssues method to retrieve issues
			issues, err := ghClient.GetOpenIssuesWithLabels(repo.Owner, repo.Name, []string{"good first issue"})
			if err != nil {
				fmt.Printf("Error fetching issues for %s: %v\n", repo.Name, err)
				continue
			}

			// Store or update each issue in the database
			for _, issue := range issues {
				issue.RepoID = repo.ID // Set the repository ID for the issue
				issue.Language = repo.Language
				if err := db.StoreIssue(&issue); err != nil {
					fmt.Printf("Error storing issue %d for repo %s: %v\n", issue.GitHubID, repo.Name, err)
				}
			}
		}
	}
}
