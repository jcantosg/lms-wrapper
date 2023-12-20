# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

clean: ## Remove generated directories
	@rm -rf dist node_modules

build: ## Build docker image
	@docker build -t universae-api-sga .

up: ## Start infrastructure
	@docker compose up -d

down: ## Stop infrastructure
	@docker compose down

start-prod: ## Start project in production mode
	@docker run -d --rm  --env-file=".env" -p3000:3000 --name universae-api-sga universae-api-sga

start-dev: ## Start project in dev mode
	@npm run start:dev

deps: ## Install project dependencies
	@npm install

lint: ## Lint code
	@npm run lint

format-lint: ## Analyze and fix code
	@npm run format
	@npm run lint

test-unit: ## Run unit tests
	@npm run test -- --passWithNoTests

database-drop: ## Remove all database collections
	@npm run sga:db:drop -- -f

database-reload: ## drop, runs migrations, seed
	@npm run sga:db:drop -- -f
	@npm run typeorm:migrations:up
	@npm run sga:db:seed:country
