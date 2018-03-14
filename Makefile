.PHONY: network postgres node

POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
POSTGRES_NAME=postgres

NODE_NAME=node

# Docker commands
network:
	docker network create --driver bridge node-sql-app

postgres:
	-docker rm -f $(POSTGRES_NAME)
	docker run -p 5432:5432 -it \
		--network=node-sql-app \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		--name $(POSTGRES_NAME) \
		-d onjin/alpine-postgres

node:  # doesn't work but kept here for clarity
	-docker rm -f $(NODE_NAME)
	docker build -t node-web-app:v1 node/.
	docker run -p 9000:80 -it \
		--network=node-sql-app \
		-e PORT=80 \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_HOST='postgres' \
		--name $(NODE_NAME) \
		node-web-app:v1
