import { Component } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private __auth: AuthService, private __router: Router) {}

  errors: string = ""

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })

  login() {
    if (!this.loginForm.valid) {
      this.errors = "Datos incorrectos"
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!email || !password) { 
      this.errors = 'Email y contraseña son obligatorios';
      return;
    }
    this.__auth.login(email, password).subscribe({
      next: () => {
        this.__auth.getUserInfo().subscribe(user => {
          const role = user.role;

          if (role === 'ADMIN') {
            this.__router.navigate(['/back-office']);
          } else {
            this.__router.navigate(['/']);
          }
        });
      },
      error: () => {
        this.errors = 'Credenciales inválidas';
      }
    });
  }

  ngOnInit() {
    this.__auth.isAuthenticated()
  }
}
