.PHONY: start secret postgres node server

start:
	minikube start

secret:
	-kubectl delete -f secret/secret.yaml
	kubectl create -f secret/secret.yaml

postgres:
	-kubectl delete -f postgres/postgres.yaml
	kubectl create -f postgres/postgres.yaml

node:
	eval $$(minikube docker-env) && docker build -t node-web-app:v1 node/.
	-kubectl delete -f node/node.yaml
	kubectl create -f node/node.yaml

logs:
	kubectl logs $$(kubectl get pods --selector=run=node -o jsonpath='{.items[0].metadata.name}{"\n"}')

server:
	minikube service node-service

# Docker commands for debugging
docker-network:
	docker network create --driver bridge node-sql-app

docker-postgres:
	-docker rm -f postgres
	docker run -p 5432:5432 -it --net=node-sql-app \
		-e POSTGRES_PASSWORD=abcd --name postgres \
		-d onjin/alpine-postgres

docker-node:  # doesn't work but kept here for clarity
	-docker rm -f node
	docker build -t node-web-app:v1 node/.
	docker run -p 9000:80 -it --net=node-sql-app -e PORT=80 \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=abcd \
		-e POSTGRES_DB='postgres' \
		-e POSTGRESS_HOST='postgres' --name node node-web-app:v1
