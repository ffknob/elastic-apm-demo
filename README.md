# An Elastic APM demo

The main goal of this demo project is to easily bring up a stack with backend, middleware and frontend that allows to take a look at some of the core features of Elastic APM.

Elastic APM is Elastic's solution for gathering applications' performance metrics in order to give developers a way to observe their applications for common points of failures and performance bottlenecks.

## Overview

This demo project is organized as a `docker-compose` configuration with the following five services:

- _elasticsearch_: an Elasticsearch one node cluster
- _kibana_: a Kibana installation, which depends on the _elasticsearch_ service and exposes port `5601`
- _apm-server_: an Elastic APM server, which also depends on the _elasticsearch_ service and is responsible for receiving performance metrics and sending them to the cluster
- _app-middleware_: a Node.js+Express application, which acts as a middleware bettwen the frontend and the backend, simulating requests workload and sending metrics to the APM server
- _app-frontend_: a simple frontend where the user can parametrized and simulate requests to the middleware

## Pre-requisites

You should have `docker` and `docker-compose` installed in you machine in order to use this project. Refer to Docker's official documentation in order to find out how you can install them in your system.

## Configuration

For each of Elastic's product used in this demo project there is a folder in `./config` containing the respective configuration file. If you need to change any parameter for one of theses products, change the file and restart the container.

There's also a `.env` file in which some environment variables used inside the `docker-compose.yml` and `Dockerfile`'s are set. If you change any of these variables you'll need to rebuild the containers (I guess `docker-compose up -d` automatically does that for you).

## Running

`docker-compose up -d`

## Stopping

`docker-compose down`
