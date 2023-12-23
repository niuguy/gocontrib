package github

import (
	"context"
	"github.com/google/go-github/v56/github"
	"golang.org/x/oauth2"
)

const (
	perPage      = 100
	minStarCount = 1000
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
