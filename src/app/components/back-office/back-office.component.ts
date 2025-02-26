import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface Product {
  reference: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sale: boolean;
  image: string;
}

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent {
  productForm = new FormGroup({
    reference: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    productPrice: new FormControl(0, [Validators.required, Validators.min(1)]),
    productDescription: new FormControl(''),
    productType: new FormControl(''),
    onSale: new FormControl(false),
    productImage: new FormControl(''),
  });

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Datos del formulario:', this.productForm.value);
    } else {
      console.log('El formulario contiene errores.');
    }
  }
}
