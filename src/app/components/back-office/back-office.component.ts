import { Component } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product, CATEGORIES } from '../../models';
import { ProductService } from '../../services/add-products.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-back-office',
  imports: [ReactiveFormsModule],
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.css'],
})
export class BackOfficeComponent {
  foundProduct: Product | undefined;
  imageUrl: string | null = null;
  supabase: SupabaseService = new SupabaseService();
  bucket: string = 'images'

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
    ]),
    productPrice: new FormControl(0, [Validators.required, Validators.min(1)]),
    productDescription: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(255),
    ]),
    productType: new FormControl<CATEGORIES | null>(null, [Validators.required]),
    onSale: new FormControl(false, [Validators.nullValidator]),
    productImage: new FormControl(''),
  });

  constructor(private productService: ProductService) {}

  uniqueName(control: FormControl) {
    const products = this.productService.products();
    const nameExist = products.some(
      (product) => product.name.toLowerCase() === control.value?.toLowerCase()
    );
    return nameExist ? { nameExist: true } : null;
  }

  checkReference() {
    const ref = this.productForm.controls.reference.value?.trim();
    const foundProduct = this.productService.products().find(
      p => p.reference.includes(ref || "") && ref?.length === p.reference.length
    );

    if (foundProduct) {
      this.productForm.controls.reference.setValue(foundProduct.reference || " ");
      this.productForm.controls.productName.setValue(foundProduct.name || " ");
      this.productForm.controls.productDescription.setValue(foundProduct.description || " ");
      this.productForm.controls.productPrice.setValue(foundProduct.price);
      this.productForm.controls.productType.setValue(foundProduct.category);
      this.productForm.controls.productImage.setValue(foundProduct.image || " ");
      console.log(foundProduct);
    }
  }

  clearReference() {
    this.productForm.controls.reference.setValue("");
    this.productForm.controls.productName.setValue("");
    this.productForm.controls.productDescription.setValue("");
    this.productForm.controls.productPrice.setValue(0);
    this.productForm.controls.productType.setValue(null);
    this.productForm.controls.productImage.setValue("");

    this.productForm.reset();
    this.productForm.markAsUntouched();
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
        image: this.imageUrl || "", // Ahora imageUrl es un string
      };

      console.log(product);
      this.productService.addProduct(product);
      console.log(this.productService.getProducts());
      this.productForm.markAsUntouched();
      this.productForm.reset();
    } else {
      console.log('El formulario contiene errores.');
    }
  }

    async onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
        const file: File = input.files[0];
        console.log('Archivo seleccionado:', file);

        const filePath = `imagenes/${file.name}`;
        console.log('filePath: ', filePath);

        await this.supabase.uploadImage(file, this.bucket);
        const url = await this.supabase.getPublicUrl(this.bucket, filePath);
        this.imageUrl = url;
      }
    }

  }

