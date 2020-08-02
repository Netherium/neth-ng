import { Component, Inject } from '@angular/core';
import { User } from '../user.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpGenericService } from '../../../services/http-generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadDialogComponent } from '../../../dialogs/upload-dialog/upload-dialog.component';
import { Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../../models/role.model';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html'
})
export class UserDialogComponent {
  isLoading = false;
  user: User;
  filteredRoles: Observable<Role[]>;
  roleChangedSub: Subject<string> = new Subject<string>();
  isLoadingRoles: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: string; user: User }, private httpService: HttpGenericService,
              private snackBar: MatSnackBar, public dialogRef: MatDialogRef<UserDialogComponent>,
              public uploadDialogRef: MatDialogRef<UploadDialogComponent>, public dialog: MatDialog) {
    console.log('data received in dialog', data)
    if (data.action === 'update') {
      this.user = {...data.user};
    }
    if (data.action === 'create') {
      this.user = data.user;
    }

    this.filteredRoles = this.roleChangedSub.pipe(
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

  roleChanged(text: string) {
    this.roleChangedSub.next(text);
  }

  roleDisplayFn(role: Role): string {
    if (role) {
      return role.name;
    }
  }

  save() {
    console.log(this.user);
    this.isLoading = true;
    let obs: Observable<User | HttpErrorResponse>;
    if (this.data.action === 'create') {
      obs = this.httpService.create<User>('users', this.user);
    } else {
      obs = this.httpService.update<User>('users', this.user)
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
}

