import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule ,
    MatButtonModule,
    NgFor,
    CurrencyPipe,
    MatProgressSpinnerModule // Add this import
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: any[] = [];
  currentPage = 1;
  pageSize = 12;
  totalProducts = 0;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.currentPage, this.pageSize)
      .subscribe((res: any) => {
        this.products = res.products;
        this.totalProducts = res.total;
      });
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.totalProducts) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }}
  totalPages(): number {
      return Math.ceil(this.totalProducts / this.pageSize);
    }
  onPageSizeChange() {
      this.currentPage = 1;
      this.loadProducts();
    }
  viewDetails(id: string) {
    this.router.navigate(['/product', id]);
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}