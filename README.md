<h1 align="center">
  Neth-ng
</h1>
<h4 align="center">A frontend admin panel written in Typescript using <a href="https://github.com/angular" target="_blank">Angular</a> and <a href="https://github.com/angular/material" target="_blank">Angular Material</a></h4>
<h5 align="center">Modules, file-upload/dynamic-table components, generic http services, bundled with Material awesomeness!!!</h5>
<h5 align="center">See it in action with <a href="https://www.npmjs.com/package/@netherium/api-gen" target="_blank">@netherium/api-gen</a></h5>
<div align="center">
  <sub>Made with ❤ by <a href="https://github.com/Netherium">Netherium</a></sub>
</div>

## Structure

Follow the structure below. It will keep things and your mind tidy :blossom:

    Client
    .
    ├── dist                            # Compiled files ready to deploy `npm run build`
    │
    ├── src                             # Your code goes here
    │   ├── app             
    │   │   ├── components              # Shared components throughout the Angular app
    │   │   ├── models                  # Shared models throughout the Angular app    
    │   │   ├── services                # Shared core services throughout the Angular app
    │   │   ├── dialogs                 # Shared dialogs
    │   │   ├── modules                 # Lazy loaded modules, each generated resource corresponds to 1 module
    │   │   └── app-routing.module.ts   # Routing module that binds all lazy loaded modules, each generated resource has a child under `childrenRoutes`  
    │   ├── assets                      # Static resources
    │   ├── environments                # Angular environment configuration
    │   ├── theming                     # Angular Material Theming Styles
    │                      
    ... Rest Default Angular Structure

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Authors
**[Netherium](https://github.com/Netherium)**


## Copyright and license
Code released under [the MIT license](https://github.com/Netherium/neth-express-api-ts/blob/master/LICENSE)
