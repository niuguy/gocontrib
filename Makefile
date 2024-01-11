.PHONY: \
	ui  \
	app

ui:
	cd ui && pnpm run build

app:
	go build -o bin/gocrontrib main.go

start:
	go run main.go
