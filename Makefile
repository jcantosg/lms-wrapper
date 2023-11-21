# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

up: ## Start infrastructure
	@docker-compose up -d

down: ## Stop infrastructure
	@docker-compose down

start: ## Start project
	@npm run start

start-dev: ## Start project in dev mode
	@npm run start:dev

clean: ## Remove generated directories
	@rm -rf dist node_modules

deps: ## Install project dependencies
	@npm install

lint: ## Lint code
	@npm run lint

format-lint: ## Analyze and fix code
	@npm run format
	@npm run lint

test-unit: ## Run unit tests
	@npm run test -- --passWithNoTests
