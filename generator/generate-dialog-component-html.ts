import { promises as fs } from 'fs';
// @ts-ignore
import { input } from './sample';
import { firstUpperCase, pascalCase } from './utility.functions';
import { UIEntity } from './ui.entity.model';
import pluralize = require('pluralize');

const inputStringFragment = (entityName: string, field: string, pascalCaseField: string) => {
  return `  <mat-form-field class="w-100">
    <mat-label>${pascalCaseField}</mat-label>
    <input [(ngModel)]="${entityName}.${field}" autocomplete="off" matInput name="${field}">
    <mat-icon matSuffix>text_fields</mat-icon>
  </mat-form-field>\n`;
}

const inputNumberFragment = (entityName: string, field: string, pascalCaseField: string) => {
  return `  <mat-form-field class="w-100">
    <mat-label>${pascalCaseField}</mat-label>
    <input [(ngModel)]="${entityName}.${field}" autocomplete="off" matInput name="${field}" type="number">
    <mat-icon matSuffix svgIcon="neth:numeric"></mat-icon>
  </mat-form-field>\n`;
}

const inputDateFragment = (entityName: string, field: string, pascalCaseField: string, dateId: number) => {
  return `  <mat-form-field class="w-100">
    <mat-label>${pascalCaseField}</mat-label>
    <input [(ngModel)]="${entityName}.${field}" [matDatepicker]="picker${dateId}" autocomplete="off" matInput
           name="${field}">
    <mat-datepicker-toggle [for]="picker${dateId}" matSuffix></mat-datepicker-toggle>
    <mat-datepicker #picker${dateId}></mat-datepicker>
  </mat-form-field>\n`;
}

const inputBooleanFragment = (entityName: string, field: string, pascalCaseField: string) => {
  return `  <div class="w-100 mb-3">
    <mat-slide-toggle [(ngModel)]="${entityName}.${field}" name="${field}">
      ${pascalCaseField}
    </mat-slide-toggle>
  </div>\n`
}

const inputSingleObjectFragment = (entityName: string, field: string, pascalCaseField: string, pluralUppercaseField: string) => {
  return `  <mat-form-field class="w-100">
    <mat-label>${pascalCaseField}</mat-label>
    <input matInput [matAutocomplete]="${field}Auto" [(ngModel)]="${entityName}.${field}" (ngModelChange)="${field}Changed($event)"
           autocomplete="off" name="${field}">
    <mat-spinner *ngIf="isLoading${pluralUppercaseField}" diameter="20" matSuffix></mat-spinner>
    <mat-autocomplete #${field}Auto="matAutocomplete" [displayWith]="display${pascalCaseField}Fn">
      <mat-option *ngFor="let ${field} of filtered${pluralUppercaseField} | async" [value]="${field}">
        {{${field}.name}}
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>\n`;
}

const formFragment = (fieldsFragment: string) => {
  return `<form #entityForm="ngForm" id="entityForm" novalidate>
${fieldsFragment}  <div class="d-flex justify-content-end">
    <ng-container>
      <button (click)="save()" *ngIf="!isLoading; else loadingButton" [disabled]="entityForm.pristine"
              color="primary" mat-raised-button>Save
      </button>
      <ng-template #loadingButton>
        <button color="accent" disabled mat-raised-button>
          <mat-spinner class="m-2" diameter="20"></mat-spinner>
        </button>
      </ng-template>
    </ng-container>
  </div>
</form>`;
}

export const generateDialogComponent = (entity: UIEntity) => {
  let output = '';
  let fieldsFragmentOutput = '';
  let dateId = 1;
  for (const field of entity.fields) {
    switch (field.type) {
      case 'String':
        fieldsFragmentOutput += inputStringFragment(entity.name, field.name, pascalCase(field.name));
        break;
      case 'Number':
        fieldsFragmentOutput += inputNumberFragment(entity.name, field.name, pascalCase(field.name));
        break;
      case 'Date':
        fieldsFragmentOutput += inputDateFragment(entity.name, field.name, pascalCase(field.name), dateId);
        dateId++;
        break;
      case 'Boolean':
        fieldsFragmentOutput += inputBooleanFragment(entity.name, field.name, pascalCase(field.name));
        break;
      case 'ObjectId':
        fieldsFragmentOutput += inputSingleObjectFragment(entity.name, field.name, pascalCase(field.name), pascalCase(pluralize(field.name)));
        break;
    }
  }
  return formFragment(fieldsFragmentOutput);
}



