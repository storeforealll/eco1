import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) { }

  // Existing method for paginated products
  getProducts(page: number, pageSize: number): Observable<any> {
    const skip = (page - 1) * pageSize;
    return this.http.get(`${this.apiUrl}?limit=${pageSize}&skip=${skip}`);
  }

  // Add this new method for single product
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}