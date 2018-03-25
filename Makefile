.PHONY: network postgres api

SHELL=bash

POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
POSTGRES_NAME=postgres
POSTGRES_HOST=postgres-host

API_NAME=api
API_WORKDIR=/var/app
API_TAG_DEV=api:dev
API_TAG_PROD=api:prod
API_PORT=9000
API_HOST=api-host

APP_NAME=app
APP_WORKDIR=/var/app
APP_TAG_DEV=app:dev
APP_TAG_PROD=app:prod
APP_PORT=8080

NETWORK_NAME=api-sql-app

# Docker commands
network:
	-docker network rm $(NETWORK_NAME)
	docker network create --driver bridge $(NETWORK_NAME)

postgres:
	-docker rm -f $(POSTGRES_NAME)

	docker run -p 5432:5432 -it \
		--network=$(NETWORK_NAME) \
		--network-alias=$(POSTGRES_HOST) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		--name $(POSTGRES_NAME) \
		-d onjin/alpine-postgres

api-prod:
	docker build -t $(API_TAG_PROD) \
		-f ./api/Dockerfile.Prod \
	  --build-arg API_WORKDIR=$(API_WORKDIR) \
		api/.

api-dev: api-prod
	-docker rm -f $(API_NAME)

	docker build -t $(API_TAG_DEV) \
		-f ./api/Dockerfile.Dev \
		--build-arg API_TAG_PROD=$(API_TAG_PROD) \
		--build-arg API_WORKDIR=$(API_WORKDIR) \
		api/.

	# Note that the local volume mount path must be absolute
	docker run -p $(API_PORT):$(API_PORT) -it \
		--volume $(shell pwd)/api/src:$(API_WORKDIR)/src \
		--network=$(NETWORK_NAME) \
		--network-alias=$(API_HOST) \
		-e API_PORT=$(API_PORT) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		--name $(API_NAME) \
		$(API_TAG_DEV)

api:api-dev

app-prod:
	-docker rm -f $(APP_NAME)

	docker build -t $(APP_TAG_PROD) \
		-f ./app/Dockerfile.Prod \
	  --build-arg APP_WORKDIR=$(APP_WORKDIR) \
		app/.

	# docker run -p $(APP_PORT):$(APP_PORT) -it \
	# 	--network=$(NETWORK_NAME) \
	# 	--name $(APP_NAME) \
	# 	$(APP_TAG_PROD)

app-dev: app-prod
	-docker rm -f $(APP_NAME)

	docker build -t $(APP_TAG_DEV) \
		-f ./app/Dockerfile.Dev \
		--build-arg APP_TAG_PROD=$(APP_TAG_PROD) \
		--build-arg APP_WORKDIR=$(APP_WORKDIR) \
		app/.

	# Note that the local volume mount path must be absolute
	docker run -p $(APP_PORT):$(APP_PORT) -it \
		--volume $(shell pwd)/app/src:$(APP_WORKDIR)/src \
		--network=$(NETWORK_NAME) \
		--network-alias=app \
		--name $(APP_NAME) \
		$(APP_TAG_DEV)
