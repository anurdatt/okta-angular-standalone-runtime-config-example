import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { AuthService } from '../../shared/okta/auth.service';
import { Router } from '@angular/router';
import { PaymentService } from '../payment.service';
import { CommonUtil } from '../../shared/CommonUtil';
import { Cart } from '../../cart/model/cart';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  util: CommonUtil = new CommonUtil();
  cart: Cart;
  user: string;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router,
    private zone: NgZone
  ) {
    this.cart = this.cartService.getCart();
    this.authService.getUserEmail().then((email) => (this.user = email));
  }
}
