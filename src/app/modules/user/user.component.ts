import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CollectionDataSource } from '../../models/collection-data-source';
import { User } from './user.model';
import { HttpGenericService } from '../../services/http-generic.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {
  displayedColumns = ['select', '_id', 'email', 'name', 'role', 'isVerified'];
  sort: Sort = {
    active: '_id',
    direction: 'asc'
  }
  dataSource = new CollectionDataSource<User>(this.httpService, 'users', this.sort, 0, 10, '');

  constructor(private httpService: HttpGenericService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    console.log('component user');
  }

  getTypeOf(value) {
    if (value instanceof Array) {
      return 'array';
    }
    if (typeof value === 'string') {
      const regex = /[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\d]{3}\D/;
      if (regex.test(value)) {
        return 'date'
      } else {
        return 'string'
      }
    }
    return typeof value;
  }

  createDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'create',
        user: {
          _id: '',
          email: '',
          name: '',
          role: null,
          isVerified: null,
          createdAt: '',
          updatedAt: '',
        }
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  editDialog(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'update',
        user: user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  deleteSelected() {
    console.log(this.dataSource.selection.selected);
    const sources = [];
    this.dataSource.selection.selected.forEach(user => {
      sources.push(this.httpService.delete('users', user._id));
    })
    forkJoin([...sources]).subscribe(data => {
      console.log(data);
      if (data instanceof HttpErrorResponse) {
        this.snackBar.open(`${data.error.message} ${data.error.error}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-accent']
        });
      } else {
        this.snackBar.open(`Deleted: ${sources.length}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
      }
    });
  }
}
