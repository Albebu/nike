import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { BestsellersComponent } from './bestsellers/bestsellers.component';
import { NewProductsComponent } from './new-products/new-products.component';

@Component({
  selector: 'app-landing',
  imports: [HeroComponent, BestsellersComponent, NewProductsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  
}
