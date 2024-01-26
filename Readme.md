GoContrib is a web app built for open source contributors especially for first time contributors. features include:
  *  Add any issue from any github repository to your task board
  *  Manage task status and take notes 
  *  Search for github repositories you are interested in contributing to
  *  Follow the repository and have a quick access to its help wanted/good first issues

### How to run

Make sure you have golang and pnpm(you can replace with npm) installed, then

* Clone the repo
* Get a github token with `repo` scopes and set it as `GITHUB_TOKEN` environment variable.
* Build the frontend by running `make ui` 
* Run the server by running `make run`  



You can then check the app at http://localhost:8080, the databse will be at the same directory named `gocontrib.sqlite`

### Built with

* Golang
* Reactjs + Typescript
* Github api
* Sqlite
* Material Joy UI


### For development

* Start the api server by running `make run` 
* Start the frontend server(vite) by running `make ui-run`

Go to  http://localhost:4573 to see the app running with hot reload enabled (thanks to vite)

### Contribution

Contributions are welcome. Please open an issue or a pull request.


### License

MIT License

