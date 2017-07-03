# Opp

## Install locally

### Prerequisites:
* [NodeJs > 6.10.2](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/) installed globally by running command: `npm i -g yarn`

*Notice! This project uses [Yarn](https://yarnpkg.com/en/) for dependency management - not `npm`.*

### Install deps:
* Run `yarn`

## Development
### IDE
* **[!Important]** Use [Visual Studio Code](https://code.visualstudio.com/) for development
  Not only it provides better intellisense and type checking, it has a few default linting rules that apply automatically as you code.
* Install `Angular Language Service` VSC extension to get even better intellisense.
* Install `TSLint` VSC extension for real time linting error information.

### Run locally
If you just got latest, make sure you have all dependencies installed:
* Run `yarn`

Start the server on port 5000. You can do it via running docker commands from the `opp` directory:
```
docker build -t opp .
docker run -p 5000:5000 -it opp
```

Then run one of the following commands, which will start local dev server, but point any /api requests to the running instance of Opp server
* `yarn start`.

### Build
Project is compiled into *dist* folder.
* `yarn build`.

### Running unit tests
* `yarn test`

### Running lint
* `yarn run lint`

## Technology to learn:

### Core concepts
* [Angular](https://angular.io/docs/ts/latest/guide/learning-angular.html)
* [RxJs](https://github.com/Reactive-Extensions/RxJS) - See tutorials under [Resource](https://github.com/Reactive-Extensions/RxJS#resources)
* [ngrx/store](https://github.com/ngrx/store) - See tutorials under [Introduction](https://github.com/ngrx/store#introduction)

### UI Frameworks used:
* [Angular Material](https://github.com/angular/material2)
