import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CollectionDataSource } from '../../models/collection-data-source';
import { HttpGenericService } from '../../services/http-generic.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ResourcePermissionDialogComponent } from './resource-permission-dialog/resource-permission-dialog.component';
import { ResourcePermission } from './resource-permission.model';

@Component({
  selector: 'app-resource-permission',
  templateUrl: './resource-permission.component.html'
})
export class ResourcePermissionComponent {

  columns = [
    {header: 'Select', columnDef: 'select', type: 'select'},
    {header: 'Id', columnDef: '_id', type: 'string'},
    {header: 'ResourceName', columnDef: 'resourceName', type: 'string'},
    // {header: 'Methods', columnDef: 'methods', type: 'Object[]'},
    // {header: 'CreatedAt', columnDef: 'createdAt'},
    // {header: 'UpdatedAt', columnDef: 'updatedAt'},
  ];

  displayedColumns: string[] = ['select', '_id', 'resourceName', 'methods']
  sort: Sort = {
    active: '_id',
    direction: 'asc'
  };
  dataSource = new CollectionDataSource<ResourcePermission>(this.httpService, 'resource-permissions', this.sort, 0, 10, '');

  constructor(private httpService: HttpGenericService, public dialog: MatDialog, private snackBar: MatSnackBar) {
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
    const dialogRef = this.dialog.open(ResourcePermissionDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'create',
        resourcePermission: {
          _id: '',
          resourceName: '',
          methods: []
        } as ResourcePermission
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  editDialog(resourcePermission: ResourcePermission) {
    const dialogRef = this.dialog.open(ResourcePermissionDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'update',
        resourcePermission: resourcePermission
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  deleteSelected() {
    console.log(this.dataSource.selection.selected);
    const sources = [];
    this.dataSource.selection.selected.forEach(resourcePermission => {
      sources.push(this.httpService.delete('resource-permissions', resourcePermission._id));
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
