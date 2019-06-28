# Copyright 2019 The Codo Authors.
#
# Licensed under the MIT License.

IMAGE_NAME=opencodo/ui
IMAGE_VERSION=master

help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## build codo ui docker image
	@docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} .

push: ## push ui image
	@docker push ${IMAGE_NAME}:${IMAGE_VERSION}
