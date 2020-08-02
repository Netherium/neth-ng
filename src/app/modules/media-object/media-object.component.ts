import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CollectionDataSource } from '../../models/collection-data-source';
import { MediaObject } from '../../models/media-object.model';
import { HttpGenericService } from '../../services/http-generic.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaObjectDialogComponent } from './media-object-dialog/media-object-dialog.component';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-media-object',
  templateUrl: './media-object.component.html'
})
export class MediaObjectComponent {
  displayedColumns = ['select', '_id', 'url', 'name', 'alternativeText', 'caption', 'mime', 'width', 'height', 'size'];
  sort: Sort = {
    active: '_id',
    direction: 'asc'
  }
  dataSource = new CollectionDataSource<MediaObject>(this.httpService, 'media-objects', this.sort, 0, 10, '');

  constructor(private httpService: HttpGenericService, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  createDialog() {
    const dialogRef = this.dialog.open(MediaObjectDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'create',
        mediaObject: null,
        alternativeText: '',
        caption: ''
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  editDialog(mediaObject: MediaObject) {
    const dialogRef = this.dialog.open(MediaObjectDialogComponent, {
      panelClass: 'dialog-responsive',
      data: {
        action: 'update',
        mediaObject: mediaObject,
        alternativeText: mediaObject.alternativeText,
        caption: mediaObject.caption
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
    })
  }

  deleteSelected() {
    const sources = [];
    this.dataSource.selection.selected.forEach(mediaObject => {
      sources.push(this.httpService.delete('media-objects', mediaObject._id));
    })
    forkJoin([...sources]).subscribe(data => {
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
