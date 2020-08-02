import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MultipleFileUploadComponent } from './components/multiple-file-upload/multiple-file-upload.component';
import { AuthDialogComponent } from './dialogs/auth-dialog/auth-dialog.component';
import { UploadDialogComponent } from './dialogs/upload-dialog/upload-dialog.component';
import { CommonModule } from '@angular/common';
import { SingleFileUploadComponent } from './components/single-file-upload/single-file-upload.component';



@NgModule({
  declarations: [
    MultipleFileUploadComponent,
    SingleFileUploadComponent,
    AuthDialogComponent,
    UploadDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    LayoutModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    LayoutModule,
    FormsModule,

    MultipleFileUploadComponent,
    SingleFileUploadComponent,
    AuthDialogComponent,
    UploadDialogComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})
export class SharedModule {
}
