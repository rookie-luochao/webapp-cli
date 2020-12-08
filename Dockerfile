ARG DOCKER_REGISTRY=hub-dev.rockontrol.com
FROM ${DOCKER_REGISTRY}/docker.io/querycap/webappserve:0.0.0

ARG PROJECT_NAME
COPY ./public/${PROJECT_NAME} /app
