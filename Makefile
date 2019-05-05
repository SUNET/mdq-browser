VERSION=1.0.0
NAME=mdq-browser
REGISTRY=docker.sunet.se

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

docker_push:
        docker tag $(NAME):$(VERSION) $(REGISTRY)/$(NAME):$(VERSION)
	docker push $(REGISTRY)/$(NAME):$(VERSION)

publish: all
	@npm publish --access public
