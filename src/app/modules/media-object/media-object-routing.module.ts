import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaObjectComponent } from './media-object.component';


const routes: Routes = [
  {
    path: '',
    component: MediaObjectComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaObjectRoutingModule {
}
