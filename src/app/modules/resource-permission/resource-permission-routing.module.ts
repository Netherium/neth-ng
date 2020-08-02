import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourcePermissionComponent } from './resource-permission.component';


const routes: Routes = [
  {
    path: '',
    component: ResourcePermissionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcePermissionRoutingModule {
}
