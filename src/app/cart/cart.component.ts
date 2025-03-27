import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
  discount?: number;
  thumbnail?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    CommonModule,
    CurrencyPipe,
    MatSortModule,
    MatTooltipModule,
    A11yModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations: [
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'none' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class CartComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['product', 'price', 'quantity', 'total', 'actions'];
  cartItems: CartItem[] = [];
  total = 0;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartItems() {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: items => {
          this.cartItems = items;
          this.total = this.cartService.getTotal();
          this.loading = false;
        },
        error: err => {
          this.snackBar.open('Error loading cart items', 'Close', { duration: 30 });
          this.loading = false;
        }
      });
  }

  sortData(sort: Sort) {
    const data = this.cartItems.slice();
    if (!sort.active || sort.direction === '') {
      this.cartItems = data;
      return;
    }

    this.cartItems = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'product': return this.compare(a.title, b.title, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'quantity': return this.compare(a.quantity, b.quantity, isAsc);
        case 'total': return this.compare(a.price * a.quantity, b.price * b.quantity, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/fallback-image.png';
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity > 0) {
      try {
        this.cartService.updateQuantity(id, quantity);
        this.showMessage('Quantity updated');
      } catch (error) {
        this.showMessage('Failed to update quantity', true);
      }
    }
  }

  removeItem(id: string) {
    try {
      this.cartService.removeItem(id);
      this.showMessage('Item removed from cart');
    } catch (error) {
      this.showMessage('Failed to remove item', true);
    }
  }

  private showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: isError ? 'error-snackbar' : 'success-snackbar'
    });
  }

  trackByFn(index: number, item: CartItem): string {
    return item.id;
  }
}