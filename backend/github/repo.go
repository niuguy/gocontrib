package github

import (
	"context"
	"contrib/backend/models"
	"fmt"
	"strings"

	"github.com/google/go-github/v56/github"
)

func (c *GitHubClient) GetRepositoriesWithPagination(maxCount int, languages ...string) ([]models.Repository, error) {
	var repositories []models.Repository
	page := 1

	ctx := context.Background()

	for {
		var languageQuery string
		if len(languages) > 0 {
			languageQuery = " language:" + strings.Join(languages, " language:")
		}

		query := fmt.Sprintf("stars:>%d%s", minStarCount, languageQuery)
		opts := &github.SearchOptions{
			ListOptions: github.ListOptions{PerPage: perPage, Page: page},
			Sort:        "stars",
			Order:       "desc",
		}

		result, _, err := c.client.Search.Repositories(ctx, query, opts)
		if err != nil {
			return nil, err
		}

		if len(result.Repositories) == 0 {
			break
		}

		for _, repo := range result.Repositories {
			repositories = append(repositories, models.Repository{
				GitHubID:    uint(repo.GetID()),
				Owner:       repo.GetOwner().GetLogin(),
				Name:        repo.GetName(),
				Description: repo.GetDescription(),
				Stars:       repo.GetStargazersCount(),
				OpenIssues:  repo.GetOpenIssuesCount(),
				Language:    repo.GetLanguage(),
			})
		}

		page++

		// Stop fetching if maxCount is reached.
		if len(repositories) >= maxCount {
			break
		}
	}

	// Trim the results to the specified maxCount.
	if len(repositories) > maxCount {
		repositories = repositories[:maxCount]
	}

	return repositories, nil
}

// Get starred repositories of a user
func (c *GitHubClient) GetStarredRepositoriesWithPagination(maxCount int) ([]models.Repository, error) {
	var repositories []models.Repository
	page := 1

	ctx := context.Background()

	for {
		opts := &github.ActivityListStarredOptions{
			ListOptions: github.ListOptions{PerPage: perPage, Page: page},
		}

		result, _, err := c.client.Activity.ListStarred(ctx, "niuguy", opts)
		if err != nil {
			return nil, err
		}

		if len(result) == 0 {
			break
		}

		for _, repo := range result {
			repositories = append(repositories, models.Repository{
				GitHubID:    uint(repo.Repository.GetID()),
				Owner:       repo.Repository.GetOwner().GetLogin(),
				Name:        repo.Repository.GetName(),
				Description: repo.Repository.GetDescription(),
				Stars:       repo.Repository.GetStargazersCount(),
				OpenIssues:  repo.Repository.GetOpenIssuesCount(),
				Language:    repo.Repository.GetLanguage(),
				Starred:     true,
			})
		}

		page++

		// Stop fetching if maxCount is reached.
		if len(repositories) >= maxCount {
			break
		}
	}

	// Trim the results to the specified maxCount.
	if len(repositories) > maxCount {
		repositories = repositories[:maxCount]
	}

	return repositories, nil
}
