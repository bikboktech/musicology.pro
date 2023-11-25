#!/usr/bin/bash

docker build \
    --file ${DOCKERFILE} \
    --tag ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG} \
    .
