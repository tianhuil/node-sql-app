.PHONY: network db seed api app-host app-prod

SHELL=bash

NETWORK_NAME=api-sql-app

DB_TAG=pgt-db-tag
DB_WORKDIR=/var/workdir/db
DB_NAME=pgt-postgres-name

# Postgres port cannot be modified in onjin/alpine-postgres
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
POSTGRES_HOST=postgres-host
POSTGRES_PORT=5432

API_TAG=pgt-api-tag
API_NAME=pgt-api-name
API_WORKDIR=/var/workdir/api
API_HOST=localhost
API_PORT=5001

APP_NAME=app
APP_WORKDIR=/var/app
APP_TAG_DEV=app:dev
APP_TAG_PROD=app:prod
APP_PORT=9001
APP_HOST=app-host

# Docker commands
network:
	-docker network rm $(NETWORK_NAME)
	docker network create --driver bridge $(NETWORK_NAME)

db:
	-docker rm -f $(DB_NAME)

	docker build -t $(DB_TAG) \
		--build-arg DB_WORKDIR=$(DB_WORKDIR) \
		db/.

	docker run -p $(POSTGRES_PORT):$(POSTGRES_PORT) -it \
		--volume $(shell pwd)/db:$(DB_WORKDIR):ro \
		--network=$(NETWORK_NAME) \
		--network-alias=$(POSTGRES_HOST) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		-e POSTGRES_PORT=$(POSTGRES_PORT) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		--name $(DB_NAME) \
		$(DB_TAG)

seed:
	-docker exec -it $(DB_NAME) \
		/bin/bash $(DB_WORKDIR)/load.sh schema-drop.sql

	docker exec -it $(DB_NAME) \
		/bin/bash $(DB_WORKDIR)/load.sh schema.sql

	docker exec -it $(DB_NAME) \
		/bin/bash $(DB_WORKDIR)/load.sh data.sql

api:
	-docker rm -f $(API_NAME)

	docker build -t $(API_TAG) \
		--build-arg API_WORKDIR=$(API_WORKDIR) \
		api/.

	docker run -p $(API_PORT):$(API_PORT) -it \
		--volume $(shell pwd)/api:$(API_WORKDIR):ro \
		--network=$(NETWORK_NAME) \
		-e API_PORT=$(API_PORT) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		-e POSTGRES_PORT=$(POSTGRES_PORT) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		--name $(API_NAME) \
		$(API_TAG)

app-prod:
	-docker rm -f $(APP_NAME)

	docker build -t $(APP_TAG_PROD) \
		-f ./app/Dockerfile.Prod \
		--build-arg APP_WORKDIR=$(APP_WORKDIR) \
		app/.

app-dev:
	-docker rm -f $(APP_NAME)

	docker build -t $(APP_TAG_DEV) \
		-f ./app/Dockerfile.Dev \
		--build-arg APP_WORKDIR=$(APP_WORKDIR) \
		app/.

	# Note that the local volume mount path must be absolute
	docker run -p $(APP_PORT):$(APP_PORT) -it \
		--volume $(shell pwd)/app/src:$(APP_WORKDIR)/src:ro \
		--name $(APP_NAME) \
		-e API_HOST=$(API_HOST) \
		-e API_PORT=$(API_PORT) \
		-e APP_PORT=$(APP_PORT) \
		$(APP_TAG_DEV)
