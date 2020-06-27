# Opp

## Install locally

### Prerequisites:

- [NodeJs > 6.10.2](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/) installed globally by running command: `npm i -g yarn`

_Notice! This project uses [Yarn](https://yarnpkg.com/en/) for dependency management - not `npm`._

### Install deps:

- Run `yarn`

## Development

### IDE

- **[!Important]** Use [Visual Studio Code](https://code.visualstudio.com/) for development
  Not only it provides better intellisense and type checking, it has a few default linting rules that apply automatically as you code.
- Install `Angular Language Service` VSC extension to get even better intellisense.
- Install `TSLint` VSC extension for real time linting error information.

### Run locally

If you just got latest, make sure you have all dependencies installed:

- Run `yarn`

If you want to develop with mock data, the just run `yarn start`.

If you want to run front-end against the server, you need to start it.
Start the server on port 5000. You can do it via running docker commands from the `opp` directory:

```
docker build -t opp .
docker run -p 5000:5000 -it opp
```

Then run one of the following commands, which will start local dev server, but point any /api requests to the running instance of Opp server

- `yarn start:with-server`

#### Testing PWA functionality

- generate cert files - run `./cert/makeCert.bat`
- register the generated certificate in your OS
- `npm i -g http-server` - only once
- `npm run build:prod` - this creates production build in ./dist folder
- `npm run server:dist` - serves files from ./dist
- open `https://localhost:8080/`

### Test user credentials:

- username: demo
- password: demo
- passphrase: phrase

### Build

#### Dev build:

- `yarn build`.

#### Prod build:

Creates assets to be deployed to production server

- `yarn build:prod`

#### Demo build:

Creates assets to be deployed to the demo server

- `yarn build:demo`

### Running unit tests

- `yarn test`

### Running lint

- `yarn run lint`

### Evaluate bundles:

- `yarn build:stats && yarn source-map-explorer`

## Technology to learn:

### Core concepts

- [Angular](https://angular.io/docs/ts/latest/guide/learning-angular.html)
- [RxJs](https://github.com/Reactive-Extensions/RxJS) - See tutorials under [Resource](https://github.com/Reactive-Extensions/RxJS#resources)
- [Akita](https://datorama.github.io/akita/)

### UI Frameworks used:

- [Angular Material](https://github.com/angular/material2)
