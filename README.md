# My Emotions 🐎

This project has been developed for educational purpose only. Maybe in the near future, some video tutorials would be made.

## Introduction

We are using [Lerna](https://lerna.js.org) to have multiple JavaScript projects in the monorepo world.

## Install Dependencies

On the root of the project.

```
yarn install
```

> with running this command all of the project dependencies will be install.

## Pre Requirements

### Docker Services

On the development environment you just need to run `docker/dev/docker-compose.yml` to run `postgres` and `redis` service.

```
cd docker/dev
docker-compose up -d
```

### Configure ENV variables

this project has two main packages `backend` and `pwa` both of them has a file named `.env_sample` please provide it as `.env` file with proper values.
