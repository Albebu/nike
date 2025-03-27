import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private __http: HttpClient, private __auth: AuthService) { }

  getCartItems(): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no disponible');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.__http.get('http://localhost:3000/api/cart/items', { headers });
}

}
