// product-details.component.ts
import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule], 
  template: `
    <div class="product" *ngIf="product">
      <h2>{{ product.title }}</h2>
      <p>{{ product.description }}</p>
      <p>Price: \${{ product.price }}</p>
      <p>Stock: {{ product.stock }}</p>
      <button class="btn" (click)="addToCart(product)">Add to Cart</button>
    </div>
  `,
   styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productService.getProductById(params['id'])
        .subscribe((product: any) => this.product = product);
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}