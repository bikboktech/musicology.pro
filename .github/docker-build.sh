#!/usr/bin/bash

docker build \
    --file ${DOCKERFILE} \
    --tag ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG} \
    --build-arg NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    --build-arg NEXT_PUBLIC_AUTH_COOKIE_KEY=${NEXT_PUBLIC_AUTH_COOKIE_KEY} \
    .
