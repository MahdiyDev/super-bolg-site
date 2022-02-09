<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# OrmConfig

Create `ormconfig.json` to activate Orm

```
{
  "type": "",                                 // Ex: postgres
  "host": "",                                 // Ex: localhost
  "port": ,                                   // Ex: 5432 in number
  "username": "",                             // Ex: postgres
  "password": "",                             // Ex: 1407
  "database": "",                             // Ex: super_blog_site
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}
```
