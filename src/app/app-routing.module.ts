import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { MultipleFileUploadComponent } from './components/multiple-file-upload/multiple-file-upload.component';
import { SingleFileUploadComponent } from './components/single-file-upload/single-file-upload.component';


const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuardService],
    data: {
      state: 'users',
      slug: 'Users',
      icon: 'person'
    }
  },
  {
    path: 'resource-permissions',
    loadChildren: () => import('./modules/resource-permission/resource-permission.module').then(m => m.ResourcePermissionModule),
    canActivate: [AuthGuardService],
    data: {
      state: 'resourcePermissions',
      slug: 'Resource Permissions',
      icon: 'admin_panel_settings'
    }
  },
  {
    path: 'media-objects',
    loadChildren: () => import('./modules/media-object/media-object.module').then(m => m.MediaObjectModule),
    data: {
      state: 'mediaObjects',
      slug: 'Media Objects',
      icon: 'cloud_upload'
    }
  },
  {
    path: 'file-uploads',
    component: MultipleFileUploadComponent,
    data: {
      state: 'fileUploads',
      slug: 'FileUploads',
      icon: 'image'
    }
  },
  {
    path: 'single-upload',
    component: SingleFileUploadComponent,
    data: {
      state: 'singleUpload',
      slug: 'Single Upload',
      icon: 'image'
    }
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule),
    canActivate: [AuthGuardService],
    data: {
      state: 'products',
      slug: 'Products',
      icon: 'local_offer'
    }
  },

  {
    path: 'books',
    loadChildren: () => import('./modules/book/book.module').then(m => m.BookModule),
    canActivate: [AuthGuardService],
    data: {
      state: 'books',
      slug: 'Books',
      icon: 'tag'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
