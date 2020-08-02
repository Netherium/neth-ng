import { input } from './sample';
import { promises as fs } from "fs";
import { generateDialogComponent } from './generate-dialog-component-html';
import { camelCase, kebabCase, pascalCase } from './utility.functions';
// import { camelize } from 'tslint/lib/utils';
// import {camelCase, kebabCase}from 'lodash';

const toKebab = (str: string) =>{
  //([a-z0-9])([A-Z])|
  // return str.replace(/([a-z0-9])\.([a-z])/g, '$1-$2');
  return str.split(/[_\s.]/).join("-");
}
(async () => {

  const exampleStrings = ['--','book-flights', 'bookFlightsArea', 'book.flights',  'book.Flights', 'BookFlights', 'book_flights'];
  // const exString = 'book-flights';

  for(const str of exampleStrings){
    console.log(kebabCase(str));
    // const camel = camelCase(str);
    // const pascal = pascalCase(str);
    // const kebab = kebabCase(str);
    //
    // console.log('example', str, 'to camel =>', camel);
    // console.log('example', str, 'to pascal =>', pascal);
    // console.log('example', str, 'to kebab =>', kebab);
  }
  // const camelized = camelize(exString);
  // const kebab = kebabCase(exString);


  for (const entity of input.entities) {
    await fs.writeFile(`./src/app/modules/${kebabCase(entity.name)}/${kebabCase(entity.name)}-dialog/${kebabCase(entity.name)}-dialog.component.html`, generateDialogComponent(entity));
  }
})();
