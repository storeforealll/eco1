import { Component } from '@angular/core';
import { CartService } from './services/cart.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });
  }
}