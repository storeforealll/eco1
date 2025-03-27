import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
  thumbnail: string;
}

// Optionally, define a Product interface for clearer API usage
export interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  // Internal BehaviorSubject to hold the cart items
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  
  // Public observable to subscribe to cart updates
  cartItems$ = this.cartItems.asObservable();

  /**
   * Adds a product to the cart. If the product already exists, its quantity is incremented (if stock allows).
   * @param product The product to be added, conforming to the Product interface.
   */
  addToCart(product: Product): void {
    const currentCart = this.cartItems.value;
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if within stock limit
      const existingItem = currentCart[existingItemIndex];
      if (existingItem.quantity < product.stock) {
        // Create a new object to ensure immutability
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        const updatedCart = [
          ...currentCart.slice(0, existingItemIndex),
          updatedItem,
          ...currentCart.slice(existingItemIndex + 1)
        ];
        this.cartItems.next(updatedCart);
      } else {
        console.warn(`Cannot add more of ${product.title}. Stock limit reached.`);
      }
    } else {
      // Add new item with a quantity of 1
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        thumbnail: product.thumbnail,
      };
      this.cartItems.next([...currentCart, newItem]);
    }
  }

  /**
   * Updates the quantity of a specific item in the cart.
   * @param id The id of the item.
   * @param quantity The new quantity. Must be positive and not exceed the stock.
   */
  updateQuantity(id: string, quantity: number): void {
    if (quantity < 1) {
      console.warn('Quantity must be at least 1.');
      return;
    }
    const currentCart = this.cartItems.value;
    const itemIndex = currentCart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      const item = currentCart[itemIndex];
      if (quantity <= item.stock) {
        // Update the item immutably
        const updatedItem = { ...item, quantity };
        const updatedCart = [
          ...currentCart.slice(0, itemIndex),
          updatedItem,
          ...currentCart.slice(itemIndex + 1)
        ];
        this.cartItems.next(updatedCart);
      } else {
        console.warn(`Cannot set quantity to ${quantity}. Only ${item.stock} items in stock.`);
      }
    } else {
      console.warn(`Item with id ${id} not found in cart.`);
    }
  }

  /**
   * Removes an item from the cart based on its id.
   * @param id The id of the item to be removed.
   */
  removeItem(id: string): void {
    const updatedCart = this.cartItems.value.filter(item => item.id !== id);
    this.cartItems.next(updatedCart);
  }

  /**
   * Clears the entire cart.
   */
  clearCart(): void {
    this.cartItems.next([]);
  }

  /**
   * Retrieves the total cost of the items in the cart.
   * @returns The total price.
   */
  getTotal(): number {
    return this.cartItems.value.reduce((acc, item) => 
      acc + (item.price * item.quantity), 0);
  }

  /**
   * Helper to get a copy of the current cart items.
   * @returns Array of CartItem.
   */
  getCartItems(): CartItem[] {
    return [...this.cartItems.value];
  }
}
