import { NgModule } from '@angular/core';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ProductComponent, ProductDialogComponent],
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  entryComponents: [ProductDialogComponent]
})
export class ProductModule {
}
