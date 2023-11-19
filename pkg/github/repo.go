package github

import (
	"context"
	"fmt"
	"github.com/google/go-github/v56/github"
	"gocontrib/pkg/models"
	"strings"
)

// Repository Define a struct to unmarshal repository data
//type Repository struct {
//	ID          int64  `json:"id"`
//	Owner        string `json:"name"`
//	Name    string `json:"full_name"`
//	Description string `json:"description"`
//	Stars       int    `json:"stargazers_count"`
//	OpenIssues  int    `json:"open_issues_count"`
//}

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
				GitHubID:    repo.GetID(),
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
