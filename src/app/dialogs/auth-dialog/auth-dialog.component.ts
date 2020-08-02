import { Component } from '@angular/core';
import { AuthCredentials } from '../../models/auth-credentials.model';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html'
})
export class AuthDialogComponent {
  isLoading = false;
  authCredentials: AuthCredentials = {
    email: 'admin@admin.com',
    password: 'qwerty'

  }

  constructor(private authService: AuthService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<AuthDialogComponent>) {
  }

  submit() {
    console.log(this.authCredentials);
    this.isLoading = true;
    this.authService.login(this.authCredentials)
      .subscribe(data => {
        this.isLoading = false;
        if (data instanceof HttpErrorResponse) {
          this.snackBar.open('Unauthorized', null, {duration: 2000, panelClass: ['mat-toolbar', 'mat-accent']});
        } else {
          this.snackBar.open(`Welcome ${data.name}!`, null, {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
          this.dialogRef.close();
        }
      });
  }
}
