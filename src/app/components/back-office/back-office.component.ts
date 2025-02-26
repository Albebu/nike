import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  imports: [ReactiveFormsModule],
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css']
})
export class BackOfficeComponent {
  reference: string = "";

  productForm = new FormGroup({
    reference: new FormControl(''),
    name: new FormControl(''),
    price: new FormControl(0),
    description: new FormControl(''),
    category: new FormControl(''),
    sale: new FormControl(false),
    image: new FormControl(''),
  });

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Datos del formulario:', this.productForm.value);
    } else {
      console.log('El formulario contiene errores.');
    }
  }
}
