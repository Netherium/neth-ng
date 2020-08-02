import { Component, Inject } from '@angular/core';
import { MediaObject } from '../../../models/media-object.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpGenericService } from '../../../services/http-generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadDialogComponent } from '../../../dialogs/upload-dialog/upload-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

interface PutMediaObject extends MediaObject {
  _id: string;
}

interface DialogMediaObjectTransfer {
  action: 'update' | 'create';
  mediaObject: MediaObject;
  alternativeText: string;
  caption: string;
}

@Component({
  selector: 'app-media-object-dialog',
  templateUrl: './media-object-dialog.component.html'
})
export class MediaObjectDialogComponent {
  isLoading = false;
  mediaObject: MediaObject;
  alternativeText: string;
  caption: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogMediaObjectTransfer, private httpService: HttpGenericService,
              private snackBar: MatSnackBar, public dialogRef: MatDialogRef<MediaObjectDialogComponent>,
              public uploadDialogRef: MatDialogRef<UploadDialogComponent>, public dialog: MatDialog) {
    if (data.action === 'update') {
      this.mediaObject = {...data.mediaObject};
      this.alternativeText = data.alternativeText;
      this.caption = data.caption;
    }
    if (data.action === 'create') {
      this.mediaObject = data.mediaObject
      this.alternativeText = data.alternativeText
      this.caption = data.caption
    }
  }

  save() {
    this.mediaObject = {
      ...this.mediaObject,
      alternativeText: this.alternativeText,
      caption: this.caption,
    };
    this.isLoading = true;
    this.httpService.update<PutMediaObject>('media-objects', this.mediaObject as PutMediaObject).subscribe(data => {
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
