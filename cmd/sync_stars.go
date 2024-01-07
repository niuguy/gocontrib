package cmd

import (
	"contrib/backend/github"
	"contrib/backend/storage"
	"fmt"
)

func SyncStaredRepos(db *storage.Storage, ghClient *github.GitHubClient) error {

	repos, err := ghClient.GetStarredRepositoriesWithPagination(1000)
	if err != nil {
		fmt.Println("Error fetching starred repos:", err)
		return err
	}

	// Store or update each repository in the database
	for _, repo := range repos {
		if err := db.StoreOrUpdateRepository(&repo); err != nil {
			fmt.Printf("Error storing repo %s: %v\n", repo.Name, err)
			continue
		}
	}

	return nil
}

func SyncStaredReposWithIssues(db *storage.Storage, ghClient *github.GitHubClient) {

	repos, err := ghClient.GetStarredRepositoriesWithPagination(1000)
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

		// retrive issues from db
		issuesFromDb, err := db.RetrieveIssuesByRepoId(int64(repo.GitHubID))
		if err != nil {
			fmt.Printf("Error fetching issues for %s: %v\n", repo.Name, err)
			continue
		}

		// compare issues from db and issues from github, if there is a new issue, store it,
		// if the issue is closed, change its status
		toUpdateIssuesId := make([]int64, 0)
		for _, issue := range issues {
			// Check if the issue already exists in the database
			if exists, _ := db.IssueExists(issue.GitHubID); exists {
				toUpdateIssuesId = append(toUpdateIssuesId, issue.GitHubID)
				db.UpdateIssue(&issue)
				continue
			} else {
				issue.RepoID = repo.GitHubID // Set the repository github ID for the issue
				issue.Language = repo.Language
				if err := db.StoreIssue(&issue); err != nil {
					fmt.Printf("Error storing issue %d for repo %s: %v\n", issue.GitHubID, repo.Name, err)
				}
			}
		}

		// if the issue not in latest open issues, change its status to closed
		for _, issue := range issuesFromDb {
			if !contains(toUpdateIssuesId, issue.GitHubID) {
				issue.Status = "closed"
				db.UpdateIssue(&issue)
			}
		}

	}

}

func contains(s []int64, e int64) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
