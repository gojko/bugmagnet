MAKEFILE_DIR:=$(dir $(abspath $(lastword $(MAKEFILE_LIST))))
#include $(MAKEFILE_DIR).env

DOCKER_IMAGE_NAME ?= bugmagnet.org/vm
DOCKER_PLATFORM ?= linux/amd64
DOCKER_IMAGE_DIR ?= docker

docker-image: docker/Dockerfile 
	docker build --platform $(DOCKER_PLATFORM) -t $(DOCKER_IMAGE_NAME) $(DOCKER_IMAGE_DIR)

DOCKER_CMD=docker run --rm \
		--platform $(DOCKER_PLATFORM) \
		-v $(MAKEFILE_DIR):$(MAKEFILE_DIR) \
		--mount type=bind,source=/tmp,target=/tmp \
		--mount type=bind,source=$$TMPDIR,target=$$TMPDIR \
		-w "$(MAKEFILE_DIR)"


shell: 
	$(DOCKER_CMD) \
	-p 7357:7357/tcp \
	-u 0 \
	-it $(DOCKER_IMAGE_NAME) 

init: docker-image

