import { Component } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { Product, CATEGORIES } from '../../services/models';

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

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css'],
})
export class BackOfficeComponent {
  productForm = new FormGroup({
    reference: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    productName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      this.uniqueName,
    ]),
    productPrice: new FormControl(0, [Validators.required, Validators.min(1)]),
    productDescription: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(255),
    ]),
    productType: new FormControl(null, [Validators.required]),
    onSale: new FormControl(false, [Validators.nullValidator]),
    productImage: new FormControl(''),
  });

  uniqueName(): Validators {
    return (control: FormControl) => {
      const nameExist = EXISTING_PRODUCTS.some(
        (product) => product.name.toLowerCase() === control.value?.toLowerCase()
      );
      return nameExist ? { nameExist: true } : null;
    };
  }

  onSubmit() {
    if (this.productForm.valid) {
      let product: Product = {
        reference: this.productForm.controls.reference.value || '',
        name: this.productForm.controls.productName.value || '',
        description: this.productForm.controls.productDescription.value || '',
        price: this.productForm.controls.productPrice.value || 100,
        category:
          this.productForm.controls.productType.value || CATEGORIES.RUNNING,
        sale: this.productForm.controls.onSale.value || false,
        image: '',
      };

      console.log(product);
      EXISTING_PRODUCTS.push(product);
    } else {
      console.log('El formulario contiene errores.');
    }
  }
}
