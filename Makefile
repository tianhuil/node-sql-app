.PHONY: network postgres node

POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
POSTGRES_NAME=postgres
POSTGRES_HOST=postgres-host

NODE_NAME=node
NODE_PORT=9000

NETWORK_NAME=node-sql-app

# Docker commands
network:
	-docker network rm -f $(NETWORK_NAME)
	docker network create --driver bridge $(NETWORK_NAME)

postgres:
	-docker rm -f $(POSTGRES_NAME)
	docker run -p 5432:5432 -it \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		--name $(POSTGRES_NAME) \
		-d onjin/alpine-postgres
	docker network connect --alias $(POSTGRES_HOST) $(NETWORK_NAME) $(POSTGRES_NAME)

node:  # doesn't work but kept here for clarity
	-docker rm -f $(NODE_NAME)
	docker build -t node-web-app:v1 node/.
	docker run -p $(NODE_PORT):$(NODE_PORT) -it \
		--network=$(NETWORK_NAME) \
		-e NODE_PORT=$(NODE_PORT) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		--name $(NODE_NAME) \
		node-web-app:v1
