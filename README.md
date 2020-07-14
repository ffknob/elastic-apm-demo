# Elastic APM Demo

## Projects

-   [Elastic APM demo: App](https://github.com/ffknob/elastic-apm-demo-app)
-   [Elastic APM demo: Api](https://github.com/ffknob/elastic-apm-demo-api)
-   [Elastic APM demo: Shared](https://github.com/ffknob/elastic-apm-demo-shared)

_(REVISAR ABAIXO)_

O principal objetivo deste projeto é demonstrar funcionalidades do Elastic APM. Para isso foi desenvolvida uma arquitetura simples, com alguns serviços de backend, uma camada de middleware e um frontend, que permite a demonstração do Elastic APM.

O Elastic APM é a solução da Elastic para coleta de métricas de performance de aplicações permitindo aos desenvolvedores observarem suas aplicações assim como pontos comuns de falha e gargalos.

## Visão geral

A arquitetura deste projeto de demonstração é organizada em um `docker-compose` contendo os seguintes serviços:

-   _mongo_: um serviço Mongo DB no qual o serviço externo irá salvar dados
-   _app-middleware_: uma aplicação NOde.js_Express que faz o papel de middleware entre o backend e o frontend simulando requisições e enviando métricas para o servidor APM
-   _app-frontend_: um frontend simples através do qual o usuário pode parametrizar e enviar requisições para a middleware
-   _external-service_: uma aplicação Node.js+Express que faz o papel de serviço externo para que seja possível demonstrar um trace distribuído

## Pré-requisitos

É necessário ter instalados `docker` e `docker-compose` para levantar a arquitetura deste projeto. Verifique na [https://docs.docker.com/get-docker/](documentação do Docker) como instalá-los.

## Configuração

Antes de levantar a arquitetura é necessário informar alguns parâmetros gerais de configuração. No diretório raiz do projeto deve ser criado um arquivo `.env` que deverá conter os seguintes parâmetros (alguns já com valores de exemplo):

```
ELASTIC_VERSION=7.6.2
ELASTIC_APM_SERVICE_NAME=elastic-apm-demo
ELASTIC_APM_EXTERNAL_SERVICE_NAME=elastic-apm-demo-external-service
ELASTIC_APM_SERVER_URL=<Url do APM obtida na Elastic Cloud>
ELASTIC_APM_SECRET_TOKEN=<Token do APM obtido na Elastic Cloud>
MIDDLEWARE_PORT=3000
EXTERNAL_SERVICE_PORT=3001
NGINX_VERSION=1.17.1-alpine
MONGODB_VERSION=3.4
```

## Levantando os serviços

`docker-compose up -d`

## Interrompendo os seviços

`docker-compose down`

## Logs

`docker-compose logs -f`
