# Build UI
FROM node:20 as uibuilder

WORKDIR /app/ui

# Copy UI source code and build it
COPY ui .

RUN npm install -g pnpm

RUN pnpm i --verbose

RUN pnpm run build 

# Build App
FROM golang:latest as appbuilder

WORKDIR /app

# Copy the Go application source code
COPY . .

# Adjusted to copy from the correct build output directory
COPY --from=uibuilder /app/ui/dist ./ui/dist

# Set environment variable for Go application
ENV GIN_MODE=release

# Build the Go application
RUN go build -o bin/gocrontrib main.go

# Final stage
FROM debian:latest

WORKDIR /app

# Install SQLite3 and ca-certificates
RUN apt-get update && \
    apt-get install -y sqlite3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Creating a non-root user and switching to it
RUN useradd -m appuser
USER appuser

# Copy the binary from the appbuilder stage
COPY --from=appbuilder /app/bin/gocrontrib .
# Copy the UI dist directory to the correct location
COPY --from=appbuilder /app/ui/dist ./ui/dist

EXPOSE 8080

CMD ["./gocrontrib"]
