[![Build Status](https://travis-ci.org/azdanov/voting-app-node.svg?branch=master)](https://travis-ci.org/azdanov/voting-app-node)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg)](https://cypress.io)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with: bulma](https://img.shields.io/badge/made%20with-bulma-01d1b2.svg)](https://github.com/jgthms/bulma)

# Voting App Node

[![Website Screenshot](https://user-images.githubusercontent.com/6123841/39922452-e3eff4e4-5527-11e8-842a-f50927bfa4e4.png)](https://node-voting-app.herokuapp.com/)

A voting app full stack project for freeCodeCamp

Made with the help of typescript, express.js, mongodb, mongoose and chart.js. For full list of
dependencies check out package.json.

For demo purposes [https://ethereal.email/](https://ethereal.email/) is used for password requests.

## Install

1. Run `cp .env.example .env` inside project directory.
2. Adjust settings for your own environment inside `.env`

## Scripts

### Building

* `yarn run build` for production (using parcel-bundler)
* `yarn run ci` for ci environments or as a backup build system (using rollup / node-sass)
* `yarn run develop` for development (using ts-node)

### Testing

* `yarn run test:e2e:open` for end-to-end testing with cypress (make sure the app is accessible on localhost)
* `yarn run test` for jest unit tests

### Database

* `yarn run db:seed` for seeding database with mock data
* `yarn run db:reset` for deleting test database
