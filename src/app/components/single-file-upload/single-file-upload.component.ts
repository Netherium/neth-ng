import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpGenericService } from '../../services/http-generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaObject } from '../../models/media-object.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../../modules/user/user-dialog/user-dialog.component';
import { UploadDialogComponent } from '../../dialogs/upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleFileUploadComponent),
      multi: true
    }
  ]
})
export class SingleFileUploadComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('inputFile', {static: true}) inputFile;
  @ViewChild('dropZone', {static: true}) dropZone: ElementRef;
  @Input() standAlone: boolean = true;
  @Input() canAddFiles = true;
  @Input() title: string;
  file: File | MediaObject = null;
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
    console.log('this.inputFile.nativeElement.files on construct', this.inputFile.nativeElement.files);
  }

  handleFileDrop(e) {
    console.log('handleFileDrop');
    e.stopPropagation();
    e.preventDefault();
    if (this.canAddFiles) {
      this.filesDragged = e.dataTransfer.files;
      Array.from(this.filesDragged).forEach(file => {
          this.file = file;
        }
      );
    }
    this.counter = 0;
    this.dropZoneEl.parentElement.classList.remove('mat-elevation-z4');
  }

  handleDragEnter(e) {
    console.log('handleDragEnter');
    e.stopPropagation();
    e.preventDefault();
    this.counter++;
    this.dropZoneEl.parentElement.classList.add('mat-elevation-z4');
  }

  handleDragLeave(e) {
    console.log('handleDragLeave');
    e.stopPropagation();
    e.preventDefault();
    this.counter--;
    if (this.counter === 0) {
      this.dropZoneEl.parentElement.classList.remove('mat-elevation-z4');
    }
  }

  handleDragOver(e) {
    // console.log('handleDragOver');
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  wtf($event) {
    console.log('file', this.file);
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      panelClass: 'dialog-full',
      // data: {
      //   action: 'update',
      //   user: user
      // }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Data received in single-file-upload', result);
    });
  }

  upload() {
    if (this.file instanceof File) {
      this.isLoading = true;
      const newMediaObject: MediaObject = {_id: ''};
      this.createSubscription = this.httpService.createUpload<MediaObject>('media-objects', newMediaObject, this.file).subscribe(data => {
        this.isLoading = false;
        if (data instanceof HttpErrorResponse) {
          this.snackBar.open(`${data.error.message} ${data.error.error ? data.error.error : ''}`, null, {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-accent']
          });
        } else {
          this.file = data;
          if (this.standAlone) {
            this.canAddFiles = false;
          }
          this.onChange(this.file);
          this.onTouched();
          this.snackBar.open(`Created: ${data._id}`, null, {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
        }
      });
    }
  }

  remove() {
    this.file = null;
    if (this.inputFile.nativeElement.files instanceof FileList && this.inputFile.nativeElement.files.length > 0) {
      this.inputFile.nativeElement.value = null;
    }
    this.onChange(this.file);
    this.onTouched();
    console.log('onRemove', this.inputFile.nativeElement.files);
    // console.log('onRemove', this.inputFile.nativeElement.files);
  }

  triggerFileUploadDialog() {
    this.inputFile.nativeElement.click();
  }

  onManualAdd() {
    console.log('onManualAdd', this.inputFile.nativeElement.files);
    if (this.inputFile.nativeElement.files instanceof FileList && this.inputFile.nativeElement.files.length > 0) {
      this.file = this.inputFile.nativeElement.files[0];
    }
    this.onChange(this.file);
    this.onTouched();
  }

  canUpload() {
    return (this.file !== null) && (this.file ! instanceof File);
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

  writeValue(file: File | MediaObject): void {
    if (file) {
      this.file = file;
    } else {
      this.file = null;
    }
  }

  ngOnDestroy() {
    if (this.createSubscription) {
      this.createSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
    this.dropZoneEl.removeEventListener('dragenter', this.handleDragEnter.bind(this), false)
    this.dropZoneEl.removeEventListener('dragleave', this.handleDragLeave.bind(this), false)
    this.dropZoneEl.removeEventListener('dragover', this.handleDragOver.bind(this), false);
    this.dropZoneEl.removeEventListener('drop', this.handleFileDrop.bind(this), false);
  }

}
