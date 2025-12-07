.PHONY: help install dev test lint format build docker-build docker-run clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Run development server"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run linters"
	@echo "  make format       - Format code"
	@echo "  make build        - Build for production"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run with Docker Compose"
	@echo "  make clean        - Clean build artifacts"

# Detect tech stack
STACK := $(shell \
	if [ -f requirements.txt ] || [ -f pyproject.toml ]; then echo "python"; \
	elif [ -f package.json ]; then echo "nodejs"; \
	elif [ -f go.mod ]; then echo "go"; \
	elif ls *.csproj 1>/dev/null 2>&1; then echo "dotnet"; \
	else echo "unknown"; fi)

# Install dependencies
install:
ifeq ($(STACK),python)
	pip install -r requirements.txt
	pip install pytest pytest-cov ruff black
else ifeq ($(STACK),nodejs)
	npm install
else ifeq ($(STACK),go)
	go mod download
else ifeq ($(STACK),dotnet)
	dotnet restore
endif

# Run development server
dev:
ifeq ($(STACK),python)
	uvicorn main:app --reload --host 0.0.0.0 --port 8000
else ifeq ($(STACK),nodejs)
	npm run dev
else ifeq ($(STACK),go)
	go run main.go
else ifeq ($(STACK),dotnet)
	dotnet run
endif

# Run tests
test:
ifeq ($(STACK),python)
	pytest tests/ -v --cov=. --cov-report=term
else ifeq ($(STACK),nodejs)
	npm test
else ifeq ($(STACK),go)
	go test -v -race -coverprofile=coverage.out ./...
else ifeq ($(STACK),dotnet)
	dotnet test
endif

# Run linters
lint:
ifeq ($(STACK),python)
	ruff check .
	black --check .
else ifeq ($(STACK),nodejs)
	npm run lint
else ifeq ($(STACK),go)
	golangci-lint run
else ifeq ($(STACK),dotnet)
	dotnet format --verify-no-changes
endif

# Format code
format:
ifeq ($(STACK),python)
	ruff check . --fix
	black .
else ifeq ($(STACK),nodejs)
	npm run lint:fix
else ifeq ($(STACK),go)
	go fmt ./...
else ifeq ($(STACK),dotnet)
	dotnet format
endif

# Build for production
build:
ifeq ($(STACK),python)
	pip install build
	python -m build
else ifeq ($(STACK),nodejs)
	npm run build
else ifeq ($(STACK),go)
	go build -o bin/app main.go
else ifeq ($(STACK),dotnet)
	dotnet publish -c Release
endif

# Docker commands
docker-build:
	docker build -t app:latest .

docker-run:
	docker-compose up --build

docker-down:
	docker-compose down

# Clean build artifacts
clean:
	rm -rf build/ dist/ *.egg-info/ .pytest_cache/ .coverage htmlcov/
	rm -rf node_modules/ .next/ coverage/
	rm -rf bin/ obj/ vendor/
	rm -f coverage.out
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
