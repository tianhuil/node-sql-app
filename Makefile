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
