import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionNotificationService {

  constructor(private snackBar: MatSnackBar) {
  }

  createSubscription<T extends { _id?: string | number }>
  (obs: Observable<T | HttpErrorResponse>, action: 'create' | 'update' | 'delete', resourceType: string, cbSuccess: any = null, cbComplete: any = null, cbError: any = null) {
    return obs.subscribe(data => {
      if (cbComplete) {
        cbComplete();
      }
      if (data instanceof HttpErrorResponse) {
        this.snackBar.open(`${data.error.message} ${data.error.error}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-accent']
        });
        if (cbError) {
          cbError();
        }
      } else {
        this.snackBar.open(`${resourceType} ${action}d ${data.hasOwnProperty('_id') ? data._id : data}`, null, {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        if (cbSuccess) {
          cbSuccess();
        }
      }
    });
  }
}
