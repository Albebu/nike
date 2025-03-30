// products.component.ts
import { Component } from '@angular/core';
import { ProductService } from '../../services/add-products.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
})

export class ProductsComponent {
  email: string = ""
  constructor(public productService: ProductService, private __http: HttpClient, public __auth: AuthService) { }

  ngOnInit() {
    this.productService.getProducts();
  }

  addProduct(reference: string): void {
    this.productService.products.update((currentProducts) =>
      currentProducts.map((product) => ({
        ...product,
        stock: product.stock - 1
      })));
    this.__auth.getUserInfo().subscribe({
      next: (userData) => {
        const email = userData.email;

        this.__http.post('http://localhost:3000/api/cart', {
          email: email,
          reference: reference,
        }).subscribe({
          next: (res) => {
            console.log("Producto añadido al carrito:", res);
          },
          error: (err) => {
            console.error("Error al añadir el producto al carrito", err);
          }
        });
      },
      error: (err) => {
        console.error("Error al obtener información del usuario", err);
      }
    });
  }

}
