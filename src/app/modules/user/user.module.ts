import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from '../../shared.module';
import { UserDialogComponent } from './user-dialog/user-dialog.component';


@NgModule({
  declarations: [UserComponent, UserDialogComponent],
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  entryComponents: [UserDialogComponent]
})
export class UserModule {
}
