VERSION=1.0.0
NAME=mdq-browser

all: snyk build

snyk:
	@npm run snyk-protect

start:
	@npm run start

clean:
	@rm -rf dist

build:
	@npm run build

tests:
	@npm run test

cover:
	@npm run cover

setup:
	@npm install

docker: all docker_build docker_push

docker_build:
	docker build --no-cache=true -t $(NAME):$(VERSION) .
	docker tag $(NAME):$(VERSION) docker.sunet.se/$(NAME):$(VERSION)

docker_push:
	docker push docker.sunet.se/$(NAME):$(VERSION)

