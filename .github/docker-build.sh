#!/usr/bin/bash

docker build \
    --file Dockerfile.BACKEND \
    --tag ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG} \
    .
