import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule],
})
export class HeaderComponent {
  showBackButton = false;
  
  constructor(public theme: ThemeService, private auth: AuthService, private router: Router, private location: Location) {
   this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.showBackButton = !(
        url === '/auth/login' || url === '/events'
      );
    });
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.auth.logout();
  }
}