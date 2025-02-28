// product.service.ts
import { Injectable, signal } from '@angular/core';
import { Product, CATEGORIES } from '../models';

const INITIAL_PRODUCTS: Product[] = [
  {
    reference: 'RED001',
    name: 'Jordan 1 negras',
    price: 120,
    description: 'bambas negras',
    category: CATEGORIES.JORDAN,
    sale: false,
  },
  {
    reference: 'RED002',
    name: 'Jordan 1 blancas',
    price: 130,
    description: 'bambas blancas',
    category: CATEGORIES.JORDAN,
    sale: false,
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Signal que almacena el listado de productos
  products = signal<Product[]>(INITIAL_PRODUCTS);

  // Método para agregar un nuevo producto y actualizar el signal
  addProduct(product: Product) {
    this.products.update((products) => [...products, product]);
  }

  getProducts(): Product[] {
    return this.products();
  }
}
