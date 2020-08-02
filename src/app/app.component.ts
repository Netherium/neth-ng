import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from './dialogs/auth-dialog/auth-dialog.component';
import { AuthService } from './services/auth.service';
import { ResponsiveLayoutService } from './services/responsive-layout.service';
import { AuthUser } from './models/auth-user.model';
import { Router, Routes } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isSmall$: Observable<boolean> = this.layout.isSmall();
  currentUser: Observable<AuthUser>;
  routerLinks: Routes;

  constructor(private layout: ResponsiveLayoutService, private breakpointObserver: BreakpointObserver,
              public loginDialog: MatDialog, private authService: AuthService,
              private router: Router, private matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.routerLinks = this.router.config;
    this.registerSVG();
    this.currentUser = this.authService.currentUser;
  }

  openLoginDialog() {
    const dialogRef = this.loginDialog.open(AuthDialogComponent, {
      data: {},
    });
  }

  auth() {
    console.log(this.authService.isAuthenticated());
  }

  logout() {
    this.authService.logout();
  }

  registerSVG() {
    this.matIconRegistry
      .addSvgIconSetInNamespace('neth',
        this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/icon-set.svg'))
  }
}
