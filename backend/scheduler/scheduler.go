package scheduler

import (
	"contrib/backend/github"
	"contrib/backend/storage"
	"fmt"
	"os"
)

func updateStaredReposAndOpenIssues() {
	// Initialize a storage instance
	db, err := storage.NewStorage()
	if err != nil {
		fmt.Println("Error initializing storage:", err)
		return
	}

	// Initialize a GitHub API client
	ghClient := github.NewGitHubClient(os.Getenv("GITHUB_TOKEN"))

	// Fetch the top 100 starred repositories
	repos, err := ghClient.GetStarredRepositoriesWithPagination(100)
	if err != nil {
		fmt.Println("Error fetching starred repos:", err)
		return
	}

	// Store or update each repository in the database
	for _, repo := range repos {
		if err := db.StoreOrUpdateRepository(&repo); err != nil {
			fmt.Printf("Error storing repo %s: %v\n", repo.Name, err)
			continue
		}

		// Fetch open issues for the repository
		issues, err := ghClient.GetOpenIssuesWithLabels(repo.Owner, repo.Name, []string{})
		if err != nil {
			fmt.Printf("Error fetching issues for %s: %v\n", repo.Name, err)
			continue
		}

		// Store or update each issue in the database
		for _, issue := range issues {
			// Check if the issue already exists in the database
			if exists, _ := db.IssueExists(issue.GitHubID); exists {
				continue
			}
			issue.RepoID = repo.GitHubID // Set the repository github ID for the issue
			issue.Language = repo.Language
			if err := db.StoreIssue(&issue); err != nil {
				fmt.Printf("Error storing issue %d for repo %s: %v\n", issue.GitHubID, repo.Name, err)
			}
		}
	}
}

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
			if err := db.StoreOrUpdateRepository(&repo); err != nil {
				fmt.Printf("Error storing repo %s: %v\n", repo.Name, err)
				continue
			}

			// Fetch "good first issue" labeled gfIssues for the repository
			// Use the GetGoodFirstIssues method to retrieve gfIssues
			gfIssues, err := ghClient.GetOpenIssuesWithLabels(repo.Owner, repo.Name, []string{"good first issue"})
			if err != nil {
				fmt.Printf("Error fetching gfIssues for %s: %v\n", repo.Name, err)
				continue
			}

			// Fetch "help wanted" labeled gfIssues for the repository
			hwIssues, err := ghClient.GetOpenIssuesWithLabels(repo.Owner, repo.Name, []string{"help wanted"})
			if err != nil {
				fmt.Printf("Error fetching hwIssues for %s: %v\n", repo.Name, err)
				continue
			}

			// Append the "help wanted" issues to the "good first issue" issues
			gfIssues = append(gfIssues, hwIssues...)

			// Store or update each issue in the database
			for _, issue := range gfIssues {
				// Check if the issue already exists in the database
				if exists, _ := db.IssueExists(issue.GitHubID); exists {
					continue
				}
				issue.RepoID = repo.GitHubID // Set the repository github ID for the issue
				issue.Language = repo.Language
				if err := db.StoreIssue(&issue); err != nil {
					fmt.Printf("Error storing issue %d for repo %s: %v\n", issue.GitHubID, repo.Name, err)
				}
			}
		}
	}
}
