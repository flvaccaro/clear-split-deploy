import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(public theme: ThemeService, private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}