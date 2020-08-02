import { Component, Inject } from '@angular/core';
import { Product } from '../product.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpGenericService } from '../../../services/http-generic.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SubscriptionNotificationService } from '../../../services/subscription-notification.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html'
})
export class ProductDialogComponent {
  isLoading = false;
  product: Product;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: string; product: Product }, private httpService: HttpGenericService,
              public dialogRef: MatDialogRef<ProductDialogComponent>, public dialog: MatDialog, private subNotSrv: SubscriptionNotificationService) {
    console.log('data received in dialog', data)
    if (data.action === 'update') {
      this.product = {...data.product};
    }
    if (data.action === 'create') {
      this.product = data.product
    }
  }

  save() {
    console.log(this.product);
    this.isLoading = true;
    let obs: Observable<Product | HttpErrorResponse>;
    if (this.data.action === 'create') {
      obs = this.httpService.create<Product>('products', this.product);

    } else {
      obs = this.httpService.update<Product>('products', this.product);
    }

    // @ts-ignore
    this.subNotSrv.createSubscription<Product>(obs, this.data.action, 'Product', () => {
      this.dialogRef.close();
    }, () => {
      this.isLoading = false;
    });
    // obs.subscribe(data => {
    //   this.isLoading = false;
    //   if (data instanceof HttpErrorResponse) {
    //     this.snackBar.open(`${data.error.message} ${data.error.error}`, null, {
    //       duration: 2000,
    //       panelClass: ['mat-toolbar', 'mat-accent']
    //     });
    //   } else {
    //     this.snackBar.open(`Saved Id: ${data._id}`, null, {
    //       duration: 2000,
    //       panelClass: ['mat-toolbar', 'mat-primary']
    //     });
    //     this.dialogRef.close();
    //   }
    // });
  }
}

