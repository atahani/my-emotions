# My Emotion Back-End

## Description

My Emotion back-end is based on [NestJS](https://docs.nestjs.com) with [GraphQL](https://docs.nestjs.com/graphql/quick-start) configurations.

## Pre Requirements

### Setting Environment Variables

We're using [nestjs-config](https://github.com/nestjsx/nestjs-config) to configure our modules based on different environment, it's based on the `.env` file in a fancy way. All of the configurations have been categorized on the `config` path. you could see the defaults values as well.

To setting environment variables see the `.env_sample` file, copy them to `.env` based on your configurations, these values will be override the default ones.

## Install Dependencies

We've used [Lerna](https://github.com/lerna/lerna) so all of the dependencies will be installed by running `yarn install` on the root of project.

## Running the App

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
