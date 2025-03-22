import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private __router: Router, private __auth: AuthService) {}

  stay() {
    this.__router.navigate(['/']);
  }

  logout() {
    this.__auth.logout()
    this.__router.navigate(['/']);
  }
}
