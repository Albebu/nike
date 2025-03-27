// product.service.ts
import { Injectable, signal } from '@angular/core';
import { Product, CATEGORIES } from '../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Signal que almacena el listado de productos
  products = signal<Product[]>([]);

  constructor (private __http: HttpClient) {}

  addProduct(product: Product): void {
  this.__http.post<Product>('http://localhost:3000/api/products', product).subscribe({
    next: (createdProduct) => {
      console.log('Producto creado:', createdProduct);
      // Puedes actualizar el listado o navegar
    },
    error: (err) => {
      console.error('Error al crear el producto', err);
    }
  });
}

removeProduct(reference: string): void {
  this.__http.delete(`http://localhost:3000/api/products/${reference}`).subscribe({
    next: (res) => {
      console.log('Producto eliminado', res);
    },
    error: (err) => {
      console.error("Error al eliminar el producto", err);
    }
  })
}

  getProducts(): void {
  this.__http.get<Product[]>('http://localhost:3000/api/products').subscribe({
    next: (products) => {
      this.products.set(products);
    },
    error: (err) => {
      console.error('Error al obtener los productos', err);
    }
  });
}
}
