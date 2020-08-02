import { NgModule } from '@angular/core';

import { MediaObjectRoutingModule } from './media-object-routing.module';
import { MediaObjectComponent } from './media-object.component';
import { SharedModule } from '../../shared.module';
import { MediaObjectDialogComponent } from './media-object-dialog/media-object-dialog.component';


@NgModule({
  declarations: [MediaObjectComponent, MediaObjectDialogComponent],
  imports: [
    SharedModule,
    MediaObjectRoutingModule
  ],
  entryComponents: [MediaObjectDialogComponent]
})
export class MediaObjectModule {
}
