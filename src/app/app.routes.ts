import { Routes } from '@angular/router';

import { BackOfficeComponent } from './components/back-office/back-office.component';
import { ProductsComponent } from './components/products/products.component';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'back-office', component: BackOfficeComponent },
];
