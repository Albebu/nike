import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private _auth: AuthService, private _router: Router) { }

  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required, Validators.minLength(3), Validators.maxLength(50)
    ]),
    email: new FormControl('', [
      Validators.required, Validators.email
    ]),
    password: new FormControl('', [
      Validators.required, Validators.minLength(8), Validators.maxLength(255)
    ])
  })

  registerFormSubmit() {
    if (this.registerForm.invalid) return

    const name = this.registerForm.get('name')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    if (
      !name ||
      !email ||
      !password
    ) return

    this._auth.register(name, email, password).subscribe({
      next: () => {
        this._auth.getUserInfo().subscribe(user => {
          const role = user.role;

          if (role === 'ADMIN') {
            this._router.navigate(['/back-office']);
          } else {
            this._router.navigate(['/']);
          }
        });
      }
    });
  }
}
