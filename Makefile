.PHONY: \
	ui  \
	app

ui:
	cd ui && pnpm run build

app:
	GIN_MODE=release go build -o bin/gocrontrib main.go

run:
	go run main.go

run-ui:	
	cd ui && pnpm run dev
