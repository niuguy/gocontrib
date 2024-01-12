package server

import (
	"context"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/go-github/github"
	"github.com/niuguy/gocontrib/models"
	"golang.org/x/oauth2"
)

type GitHubClient struct {
	client *github.Client
}

func NewGitHubClient(accessToken string) *GitHubClient {
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: accessToken},
	)
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)

	return &GitHubClient{
		client: client,
	}
}

func BindGithubApi(api *gin.RouterGroup, g *GitHubClient) {
	api.GET("/github/repo/search", func(c *gin.Context) {
		searchGithubRepo(c, g)
	})
}

func searchGithubRepo(c *gin.Context, g *GitHubClient) {
	var repositories []models.Repository

	lang := c.Query("lang")
	term := c.Query("q")
	minStars := 1000
	pageNum := 1
	pageCount := 100

	if c.Query("minStars") != "" {
		minStars, _ = strconv.Atoi(c.Query("minStars"))
	}
	if c.Query("page") != "" {
		pageNum, _ = strconv.Atoi(c.Query("page"))
	}

	if c.Query("count") != "" {
		pageCount, _ = strconv.Atoi(c.Query("count"))
	}

	ctx := context.Background()

	var languageQuery string
	if lang != "" {
		languageQuery = " language:" + lang
	}
	query := ""
	if term == "" {
		query = fmt.Sprintf("stars:>%d%s", minStars, languageQuery)
	} else {
		query = term
	}
	opts := &github.SearchOptions{
		ListOptions: github.ListOptions{PerPage: pageCount, Page: pageNum},
		Sort:        "help-wanted-issues",
		Order:       "desc",
	}

	result, _, err := g.client.Search.Repositories(ctx, query, opts)
	if err != nil {
		fmt.Printf("Error fetching repositories: %s\n", err)
	}

	if len(result.Repositories) != 0 {

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
	}

	c.JSON(200, repositories)

}
