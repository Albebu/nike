import { Routes } from '@angular/router';

import { BackOfficeComponent } from './components/back-office/back-office.component';
import { ProductsComponent } from './components/products/products.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'back-office', component: BackOfficeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'logout', component: LogoutComponent}
];
