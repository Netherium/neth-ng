import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ResourcePermissionRoutingModule } from './resource-permission-routing.module';
import { ResourcePermissionComponent } from './resource-permission.component';
import { ResourcePermissionDialogComponent } from './resource-permission-dialog/resource-permission-dialog.component';


@NgModule({
  declarations: [ResourcePermissionComponent, ResourcePermissionDialogComponent],
  imports: [
    SharedModule,
    ResourcePermissionRoutingModule
  ]
})
export class ResourcePermissionModule {
}
