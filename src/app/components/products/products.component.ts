// products.component.ts
import { Component } from '@angular/core';
import { ProductService } from '../../services/add-products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  constructor(public productService: ProductService) {}
}
