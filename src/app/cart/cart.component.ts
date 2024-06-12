import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/okta/auth.service';
import { Cart } from './model/cart';
import { CartService } from './cart.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnDestroy {
  cart: Cart;
  user: string;
  authSubscription: Subscription;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      async (isAuth) => {
        if (isAuth) this.user = await this.authService.getUserEmail();
        else this.user = undefined;
      }
    );

    this.cart = this.cartService.getCart();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  deleteItem(id: number) {
    // if (confirm('Are you sure to delete this item?')) {
    this.cartService.deleteItem(id);
    this.cart = this.cartService.getCart();
    // }
  }

  async checkOut() {
    if (this.user == undefined) {
      if (
        confirm('You need to login/signup to checkout. Do you want to proceed?')
      ) {
        await this.authService.signIn();
      }
    } else {
      this.cart.userId = this.user;
      // this.cartService.saveCartToDB(this.cart).subscribe((res) => {
      this.router.navigate(['/payment']);
      // });
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
