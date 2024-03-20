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
	@docker run -d --rm  --env-file=".env" -p3000:3000 --network=universae-network --name universae-api-sga universae-api-sga

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

test-e2e: ## Run e2e tests
	rm -rf dist
	mkdir -p files/admin-user-avatar
	mkdir -p files/edae-user-avatar
	mkdir -p files/uploads/subject-resources
	make test-database-setup
	@npm run test:e2e ; make test-database-drop
	rm -rf files/admin-user-avatar/new-admin*
	rm -rf files/edae-user/new-edae-user*
	rm -rf files/uploads/subject-resources/*



test-e2e-ci: ## Run e2e tests
	mkdir -p files/admin-user-avatar
	make test-database-setup
	mkdir -p files/edae-user-avatar
	mkdir -p files/uploads/subject-resources
	@npm run test:e2e
	make test-database-drop
	rm -rf files/admin-user-avatar/new-admin*
	rm -rf files/edae-user/new-edae-user*
	rm -rf files/uploads/subject-resources/*


database-drop: ## Remove all database collections
	@npm run sga:db:drop -- -f

database-reload: ## drop, runs migrations, seed
	@npm run sga:db:drop -- -f
	@npm run typeorm:migrations:up
	@npm run sga:db:seed:data
	@npm run sga:db:seed:evaluation-types


test-database-setup: ## Setup the test database
	@npm run sga:test:db:create
	@npm run typeorm:test:migrations:up
	@npm run sga:test:db:seed:country
	@npm run sga:test:db:seed:evaluation-types


test-database-drop: ## Drop the test database
	@npm run sga:test:db:drop -f