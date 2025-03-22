import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/add-products.service';
import { Product } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormsModule, CommonModule],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  product: string = '';

  constructor(private __productService: ProductService, public auth: AuthService) {}

  // Función que filtra la lista de productos en función del término de búsqueda
  filterProducts(): Product[] {
    const term = this.product.trim().toLowerCase();
    const products = this.__productService.products();
    if (!term) {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  }

}
