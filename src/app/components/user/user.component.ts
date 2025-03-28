import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  constructor(private __user: UserService, private __auth: AuthService, private __http: HttpClient, private __router: Router) { }

  cartItems: any[] = [];
  name: string = ""
  email: string = ""
  password: string = ""

  userForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl<string>('', [Validators.required]),
  });


  ngOnInit(): void {
    this.loadCart();
    this.__auth.getUserInfo().subscribe({
      next: (userData) => {
        this.name = userData.name;
        this.email = userData.email;
        this.password = userData.password;
      },
      error: (error) => {
        console.error("Error", error)
      }
    });
  }

  loadCart(): void {
    this.__user.getCartItems().subscribe({
      next: (res) => {
        this.cartItems = res.items;
        console.log('Items del carrito:', this.cartItems);
      },
      error: (err) => {
        console.error('Error al obtener el carrito', err);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const { name, password } = this.userForm.value;

    const body = { name, password };

    this.__http.put('http://localhost:3000/api/user', body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        this.__router.navigate(['/user']);
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
  }

}
