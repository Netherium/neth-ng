import { Pipe, PipeTransform } from '@angular/core';
import { Routes } from '@angular/router';

@Pipe({name: 'noHomeNavLinks'})
export class NoHomeNavLinksPipe implements PipeTransform {
  transform(routes: Routes) {
    return routes.filter(data => {
      return !(data.path === '' || data.path === '**');
    });
  }
}
