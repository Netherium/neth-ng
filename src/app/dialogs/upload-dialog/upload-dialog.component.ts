import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CollectionDataSource } from '../../models/collection-data-source';
import { MediaObject } from '../../models/media-object.model';
import { HttpGenericService } from '../../services/http-generic.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDialogComponent implements OnInit {

  displayedColumns = ['select', '_id', 'url', 'name', 'alternativeText', 'caption', 'mime', 'width', 'height', 'size'];
  sort: Sort = {
    active: '_id',
    direction: 'asc'
  }
  dataSource = new CollectionDataSource<MediaObject>(this.httpService, 'media-objects', this.sort, 0, 5, '', this.data);

  constructor(private httpService: HttpGenericService, public dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MediaObject[]) {
    console.log('UploadDialogComponent data', this.data);
  }

  ngOnInit() {
    // for (const mediaObject of this.data) {
    //   this.dataSource.selection.select(mediaObject);
    // }
    // console.log('selected on init', this.dataSource.selection.selected);
  }

  addSelected() {
    console.log('selection', this.dataSource.selection.selected);
    this.data = this.dataSource.selection.selected;
    // this.dialog.closeAll();
  }

  // deleteSelected() {
  //   const sources = [];
  //   this.dataSource.selection.selected.forEach(mediaObject => {
  //     sources.push(this.httpService.delete('media-objects', mediaObject._id));
  //   })
  //   forkJoin([...sources]).subscribe(data => {
  //     if (data instanceof HttpErrorResponse) {
  //       this.snackBar.open(`${data.error.message} ${data.error.error}`, null, {
  //         duration: 2000,
  //         panelClass: ['mat-toolbar', 'mat-accent']
  //       });
  //     } else {
  //       this.snackBar.open(`Deleted: ${sources.length}`, null, {
  //         duration: 2000,
  //         panelClass: ['mat-toolbar', 'mat-primary']
  //       });
  //       this.dataSource.sortingTrigger(this.dataSource.sort.getValue());
  //     }
  //   });
  // }
}
