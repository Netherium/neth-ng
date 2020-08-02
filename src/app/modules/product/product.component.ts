import { Component } from '@angular/core';
import { HttpGenericService } from '../../services/http-generic.service';
import { Sort } from '@angular/material/sort';
import { CollectionDataSource } from '../../models/collection-data-source';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Product } from './product.model';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent {
  columns = [
    {header: 'Select', columnDef: 'select'},
    {header: 'Id', columnDef: '_id', type: 'string'},
    {header: 'Name', columnDef: 'name', type: 'string'},
    {header: 'Description', columnDef: 'description', type: 'string'},
    {header: 'Price', columnDef: 'price', type: 'number'},
    {header: 'ManufactureDate', columnDef: 'manufactureDate', type: 'Date'},
    {header: 'Images', columnDef: 'images', type: 'MediaObject[]'},
    // {header: 'CreatedAt', columnDef: 'createdAt'},
    // {header: 'UpdatedAt', columnDef: 'updatedAt'},
  ];
  displayedColumns = this.columns.map(c => c.columnDef);
  sort: Sort = {
    active: '_id',
    direction: 'asc'
  };
  dataSource = new CollectionDataSource<Product>(this.httpService, 'products', this.sort, 0, 10, '');

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
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'create',
        product: {
          _id: '',
          name: '',
          description: '',
          price: null,
          manufactureDate: null,
          images: []
        }
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  editDialog(product: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'update',
        product: product
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  deleteSelected() {
    console.log(this.dataSource.selection.selected);
    const sources = [];
    this.dataSource.selection.selected.forEach(product => {
      sources.push(this.httpService.delete('products', product._id));
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
