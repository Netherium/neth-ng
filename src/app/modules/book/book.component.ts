import { Component } from '@angular/core';
import { HttpGenericService } from '../../services/http-generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CollectionDataSource } from '../../models/collection-data-source';
import { Book } from './book.model';
import { BookDialogComponent } from './book-dialog/book-dialog.component';
import { User } from '../user/user.model';
import { MediaObject } from '../../models/media-object.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html'
})
export class BookComponent {
  columns = [
    {header: 'Select', columnDef: 'select'},
    {header: 'Id', columnDef: '_id', type: 'string'},
    {header: 'Title', columnDef: 'title', type: 'string'},
    {header: 'Number', columnDef: 'isbn', type: 'number'},
    {header: 'Author', columnDef: 'author', type: 'number'},
    {header: 'IsPublished', columnDef: 'isPublished', type: 'boolean'},
    {header: 'Cover', columnDef: 'cover', type: 'MediaObject'},
    {header: 'Images', columnDef: 'images', type: 'MediaObject[]'},
    {header: 'PublishedAt', columnDef: 'publishedAt', type: 'Date'},
    {header: 'Tags', columnDef: 'tags', type: 'string[]'},
    // {header: 'ManufactureDate', columnDef: 'manufactureDate', type: 'Date'},
    // {header: 'Images', columnDef: 'images', type: 'MediaObject[]'},
    // {header: 'CreatedAt', columnDef: 'createdAt'},
    // {header: 'UpdatedAt', columnDef: 'updatedAt'},
  ];
  displayedColumns = this.columns.map(c => c.columnDef);
  sort: Sort = {
    active: '_id',
    direction: 'asc'
  };
  dataSource = new CollectionDataSource<Book>(this.httpService, 'books', this.sort, 0, 10, '');

  constructor(private httpService: HttpGenericService, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  createDialog() {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'create',
        book: {
          _id: '',
          title: '',
          isbn: null,
          author: null,
          cover: null,
          images: [],
          publishedAt: null,
          tags: []
        } as Book
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  editDialog(book: Book) {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'update',
        book: book
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  deleteSelected() {
    console.log(this.dataSource.selection.selected);
    const sources = [];
    this.dataSource.selection.selected.forEach(book => {
      sources.push(this.httpService.delete('books', book._id));
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
