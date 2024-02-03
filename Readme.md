## About

GoContrib is a web app built for contributors to manage their contributions to any github repository.

features:

  
👉 **Search & explore github repositories**
![image](https://github.com/niuguy/gocontrib/assets/1400357/2f928c91-57ca-412a-bf4a-a1e761f78f8b)
    
👉 **Set up quick access to your favorite repos**
![image](https://github.com/niuguy/gocontrib/assets/1400357/e5ac5ff2-676b-43bd-b872-e6d22a9b5bf0)

👉 **Add any issue to your task board**
![image](https://github.com/niuguy/gocontrib/assets/1400357/1aa4bdf7-b68b-4d63-9698-9a8d588d7b00)

👉 **Manage task status and add notes**



## How to run

### Using docker

Make sure you have docker and docker-compose installed, then add your github token to the `docker-compose.yml` file and run `docker-compose up`

You can then check the app at http://localhost:8080, the databse will be at the path you specified in the `docker-compose.yml` file.


### Using local environment

Make sure you have golang and pnpm(you can replace with npm) installed, then

* Clone the repo
* Get a github token with `repo` scopes and set it as `GITHUB_TOKEN` environment variable.
* Build the frontend by running `make ui` 
* Run the server by running `make run`  

You can then check the app at http://localhost:8080, the databse will be at your home path under `~/.contrib`

## Built with

* Golang
* Reactjs + Typescript
* Github api
* Sqlite
* Material Joy UI


## For development

* Start the api server by running `make run` 
* Start the frontend server(vite) by running `make ui-run`

Go to  http://localhost:4573 to see the app running with hot reload enabled (thanks to vite)

## Contribution

As you can tell from the name ;)s contributions are warmly welcome! feel free to open an issue or submit pull request.

