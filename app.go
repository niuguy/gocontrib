package main

import (
	"context"
	"contrib/backend/cmd"
	"contrib/backend/github"
	"contrib/backend/models"
	"contrib/backend/storage"
	"fmt"
)

// App struct
type App struct {
	ctx      context.Context
	storage  *storage.Storage
	ghClient *github.GitHubClient
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	storage, err := storage.NewStorage()
	if err != nil {
		fmt.Println("Error creating storage:", err)
	}

	storage.AutoMigrate()

	a.storage = storage

	github_token, err := storage.GetSettingValueByKey("github_token")
	if err != nil {
		fmt.Println("Error getting github_token from database")
	}

	if github_token != "" {

		ghClient := github.NewGitHubClient(github_token)

		a.ghClient = ghClient

		go func() {
			cmd.SyncStaredRepos(a.storage, a.ghClient)
		}()
	}

}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetIssueByRepo(owner string, name string) []models.Issue {
	issues, err := a.storage.RetrieveIssuesByRepo(owner, name)
	if err != nil {
		panic(err)
	}
	return issues
}

func (a *App) GetIssuesByRepoId(id int64) []models.Issue {

	issues, err := a.storage.RetrieveIssuesByRepoId(id)
	if err != nil {
		panic(err)
	}
	return issues
}

func (a *App) GetIssuesRemoteWithPagination(owner string, name string, labels []string, pageNum int, perPage int) ([]models.Issue, error) {

	if a.ghClient == nil {
		// when the app starts, the github token is not yet available
		github_token, err := a.storage.GetSettingValueByKey("github_token")
		if err != nil {
			fmt.Println("Error getting github_token from database")
		}
		if github_token == "" {
			return nil, fmt.Errorf("github_token is empty")
		}
		a.ghClient = github.NewGitHubClient(github_token)
	}

	issues, err := a.ghClient.GetOpenIssuesWithLabelsAndPagination(owner, name, labels, pageNum, perPage)
	if err != nil {
		return nil, err
	}
	return issues, nil
}

func (a *App) GetReposByName(name string, page, perPage int) []models.Repository {
	repos, err := a.storage.RetrieveRepositoriesByName(name, page, perPage)
	if err != nil {
		panic(err)
	}
	return repos
}

func (a *App) GetLanguages() []string {
	languages, err := a.storage.RetrieveLanguages()
	if err != nil {
		panic(err)
	}
	return languages
}

func (a *App) GetReposByLanguage(language string, page, perPage int) []models.Repository {
	if language == "" {
		return []models.Repository{}
	}
	repos, err := a.storage.RetrieveRepositoriesByLanguage(language, page, perPage)
	if err != nil {
		panic(err)
	}
	return repos
}

func (a *App) GetTasks() []models.Task {
	tasks, err := a.storage.RetrieveTasks()
	if err != nil {
		panic(err)
	}
	return tasks
}

func (a *App) AddTask(task *models.Task) error {
	return a.storage.AddTask(task)
}

func (a *App) UpdateTask(task *models.Task) error {
	return a.storage.UpdateTask(task)
}

func (a *App) AddOrUpdateSetting(setting *models.Setting) error {
	// Check if the setting exists
	exists, err := a.storage.SettingExists()
	if err != nil {
		return err
	}
	if exists {
		// Update the setting
		return a.storage.UpdateSetting(setting)
	}
	// Add the setting
	return a.storage.AddSetting(setting)
}

func (a *App) SyncStaredRepos() error {
	if a.ghClient == nil {
		// when the app starts, the github token is not yet available
		github_token, err := a.storage.GetSettingValueByKey("github_token")
		if err != nil {
			fmt.Println("Error getting github_token from database")
		}
		if github_token == "" {
			return fmt.Errorf("github_token is empty")
		}
		a.ghClient = github.NewGitHubClient(github_token)
	}

	err := cmd.SyncStaredRepos(a.storage, a.ghClient)
	if err != nil {
		fmt.Println("Error syncing stared repos:", err)
	}
	return err
}
