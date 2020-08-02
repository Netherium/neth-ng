import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpGenericService } from '../../../services/http-generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadDialogComponent } from '../../../dialogs/upload-dialog/upload-dialog.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ResourcePermission } from '../resource-permission.model';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';
import { Role } from '../../../models/role.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-resource-permission-dialog',
  templateUrl: './resource-permission-dialog.component.html'
})
export class ResourcePermissionDialogComponent {
  @ViewChild('entityForm') entityForm: NgForm;
  roleInputsSubject: Subject<string>[] = [];
  roleInputs: string[] = [];
  isLoading = false;
  resourcePermission: ResourcePermission;
  filteredRoles: Observable<Role[]>[] = [];
  isLoadingRoles: boolean;
  selectableChipListRoles = true;
  removableChipListRoles = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: string; resourcePermission: ResourcePermission }, private httpService: HttpGenericService,
              private snackBar: MatSnackBar, public dialogRef: MatDialogRef<ResourcePermissionDialogComponent>,
              public uploadDialogRef: MatDialogRef<UploadDialogComponent>, public dialog: MatDialog) {
    console.log('data received in dialog', data)
    if (data.action === 'update') {
      this.resourcePermission = {...data.resourcePermission};
    }
    if (data.action === 'create') {
      this.resourcePermission = data.resourcePermission;
    }
    for (const [index] of this.resourcePermission.methods.entries()) {
      console.log('initializing for method', index);
      this.setFilteredObservable(index);
    }
  }


  setFilteredObservable(index: number) {
    this.roleInputs[index] = '';
    this.roleInputsSubject[index] = new BehaviorSubject<string>(this.roleInputs[index]);
    this.filteredRoles[index] = this.roleInputsSubject[index].pipe(
      filter(term => !!term && typeof term === 'string'),
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => (this.isLoadingRoles = true)),
      switchMap((term: string) => this.httpService.listPaginatedCollection<Role>('roles', null, 0, 5, term)
        .pipe(
          map(data => data.data),
          finalize(() => this.isLoadingRoles = false)
        )
      )
    )
  }

  changedRole(text: string, index: number) {
    this.roleInputsSubject[index].next(text);
  }

  displayRoleFn(role: Role): string {
    if (role) {
      return role.name;
    }
  }

  remove(role: Role, methodIndex: number): void {
    console.log(role, methodIndex);
    const index = this.resourcePermission.methods[methodIndex].roles.indexOf(role);

    if (index >= 0) {
      this.resourcePermission.methods[methodIndex].roles.splice(index, 1);
    }
    this.entityForm.form.markAsDirty();

  }

  selectedRole(event: MatAutocompleteSelectedEvent, index: number): void {
    this.resourcePermission.methods[index].roles.push(event.option.value);
    this.roleInputs[index] = '';
    this.roleInputsSubject[index].next(this.roleInputs[index]);
    document.querySelector<HTMLInputElement>(`input[ng-reflect-name="roleInputs[${index}]"]`).value = this.roleInputs[index];
  }

  save() {
    console.log(this.resourcePermission);
    this.isLoading = true;
    let obs: Observable<ResourcePermission | HttpErrorResponse>;
    if (this.data.action === 'create') {
      obs = this.httpService.create<ResourcePermission>('resource-permissions', this.resourcePermission);
    } else {
      obs = this.httpService.update<ResourcePermission>('resource-permissions', this.resourcePermission)
    }
    obs.subscribe(data => {
      this.isLoading = false;
      if (data instanceof HttpErrorResponse) {
        this.snackBar.open(`${data.error.message} ${data.error.error}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-accent']
        });
      } else {
        this.snackBar.open(`Saved Id: ${data._id}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        this.dialogRef.close();
      }
    });
  }

  addMethods() {
    this.resourcePermission.methods.push(
      {
        name: '',
        roles: []
      }
    )
    const index = this.resourcePermission.methods.length - 1;
    this.setFilteredObservable(index);
  }

  removeMethods() {
    this.resourcePermission.methods.pop();
  }
}
