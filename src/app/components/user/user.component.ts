import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  cartItems: any[] = [];
  constructor(private __user: UserService) { }

  ngOnInit(): void {
    this.loadCart();
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

}
