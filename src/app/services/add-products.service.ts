// product.service.ts
import { Injectable, signal } from '@angular/core';
import { Product, CATEGORIES } from './models'; // Asegúrate de importar tus interfaces/enum

// Usamos la lista inicial
const EXISTING_PRODUCTS: Product[] = [
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
  // Definimos un signal privado con la lista inicial
  private _products = signal<Product[]>(EXISTING_PRODUCTS);

  // Exponemos un signal de solo lectura para que otros componentes puedan suscribirse
  products = this._products.asReadonly();

  // Método para añadir un producto actualizando el signal
  addProduct(product: Product) {
    this._products.update((currentProducts) => [...currentProducts, product]);
  }
}
