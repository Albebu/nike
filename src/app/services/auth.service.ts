import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private __http: HttpClient) { }
  readonly __api_url = 'http://localhost:3000/api';

  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  login(email: string, password: string): Observable<any> {
    return this.__http.post(`${this.__api_url}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.isAuthenticated.set(true);
        this.setRole();
      })
    );
  }

  setRole() {
    this.getUserInfo().subscribe({
      next: (userData) => {
        if (userData.role === 'Admin') this.isAdmin.set(true);
      }
    })
  }

  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token'); // ✅ coincide con el anterior

    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.__http.get(`${this.__api_url}/user-info`, { headers });
  }

  restoreSession(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated.set(true);
      } else {
        this.isAuthenticated.set(false)
      }
    }
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.__http.post(`${this.__api_url}/register`, {
      name,
      email,
      password
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // 👈 guardar token, no user
        this.isAuthenticated.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
  }
}
