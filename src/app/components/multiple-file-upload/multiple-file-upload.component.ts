import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaObject } from '../../models/media-object.model';
import { HttpGenericService } from '../../services/http-generic.service';
import { forkJoin, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadDialogComponent } from '../../dialogs/upload-dialog/upload-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload',
  templateUrl: './multiple-file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleFileUploadComponent),
      multi: true
    }
  ]
})
export class MultipleFileUploadComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('dropZone', {static: true}) dropZone: ElementRef;
  files: File[] | MediaObject[] = [];
  @Input() standAlone: boolean = true;
  filesDragged: FileList;
  dropZoneEl: HTMLElement;
  isLoading = false;
  createSubscription: Subscription;
  deleteSubscription: Subscription;
  counter = 0;

  constructor(private httpService: HttpGenericService, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.dropZoneEl = this.dropZone.nativeElement as HTMLElement;
    this.dropZoneEl.addEventListener('click', this.wtf.bind(this));
    this.dropZoneEl.addEventListener('dragenter', this.handleDragEnter.bind(this), false)
    this.dropZoneEl.addEventListener('dragleave', this.handleDragLeave.bind(this), false)
    this.dropZoneEl.addEventListener('dragover', this.handleDragOver.bind(this), false);
    this.dropZoneEl.addEventListener('drop', this.handleFileDrop.bind(this), false);
  }

  handleFileDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.filesDragged = e.dataTransfer.files;
    Array.from(this.filesDragged).forEach(file => {
        this.files.push(file);
      }
    );
    this.counter = 0;
    this.dropZoneEl.parentElement.classList.remove('mat-elevation-z4');
  }

  handleDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    this.counter++;
    this.dropZoneEl.parentElement.classList.add('mat-elevation-z4');
  }

  handleDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    this.counter--;
    if (this.counter === 0) {
      this.dropZoneEl.parentElement.classList.remove('mat-elevation-z4');
    }
  }

  handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  wtf($event) {
    console.log('file', this.files);
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      panelClass: 'dialog-full',
      data: this.files
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.files = [
        //  ...this.files,
        //   ...result
        // ];
        this.files = result;
        this.onChange(this.files);
        this.onTouched();
      }
      console.log('Data received in single-file-upload', result);
    });

  }

  upload() {
    console.log('upload');
    console.log(this.files);
    const sources = [];
    const fileRefs = [];
    this.files.forEach((file, fileRef) => {
      if (file instanceof File) {
        const newMediaObject: MediaObject = {_id: ''};
        sources.push(this.httpService.createUpload<MediaObject>('media-objects', newMediaObject, file));
        fileRefs.push(fileRef);
      }
    })
    this.createSubscription = forkJoin([...sources]).subscribe(data => {
      console.log(data);
      console.log('filerefs', fileRefs);
      const foundErrorResponse = data.find((entity: HttpErrorResponse) => entity instanceof HttpErrorResponse) as HttpErrorResponse;
      if (foundErrorResponse) {
        this.snackBar.open(`${foundErrorResponse.error.message} ${foundErrorResponse.error.error}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-accent']
        });
      } else {
        data.forEach((createdFile, createdFileIndex) => {
          this.files[fileRefs[createdFileIndex]] = createdFile;
        })
        this.snackBar.open(`Created: ${data.length}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
      }
    });
    this.onChange(this.files);
    this.onTouched();
  }

  remove(file: File | MediaObject) {
    let index;
    if (file instanceof File) {
      index = this.files.indexOf(file);
      console.log('index', index);
    } else {
      index = this.files.findIndex((item: MediaObject) => item._id === file._id);
      if (this.standAlone) {
        this.deleteSubscription = this.httpService.delete<MediaObject>('uploads', file._id)
          .subscribe(data => {
            if (data instanceof HttpErrorResponse) {
              this.snackBar.open(`${data.error.message} ${data.error.error}`, null, {
                duration: 2000,
                panelClass: ['mat-toolbar', 'mat-accent']
              });
            } else {
              this.snackBar.open(`Deleted: ${file._id}`, null, {
                duration: 2000,
                panelClass: ['mat-toolbar', 'mat-primary']
              });
            }
          });
      }
    }
    if (index >= 0) {
      this.files.splice(index, 1);
    }
    this.onChange(this.files);
    this.onTouched();
  }

  canUpload() {
    return this.files.some(file => (file ! instanceof File));
  }

  onChange: any = () => {
  };

  onTouched: any = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(files: File[] | MediaObject[]): void {
    console.log('writing value');
    if (files) {
      this.files = files;
    } else {
      this.files = [];
    }
  }

  ngOnDestroy() {
    if (this.createSubscription) {
      this.createSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

}
