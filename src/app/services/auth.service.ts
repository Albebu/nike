import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http2Server } from 'http2';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private __http: HttpClient) { }
  readonly __api_url = 'http://localhost:3000';

  login(email: string, password: string): Observable<any> {
    return this.__http.post(`${this.__api_url}/login`, { email, password });
  }

  register(name: string, email: string, password: string) {
    return this.__http.post(`${this.__api_url}/register`, {
      name, email, password
    })
  }

  
}
