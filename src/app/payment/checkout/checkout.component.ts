import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { AuthService } from '../../shared/okta/auth.service';
import { Router, RouterLink } from '@angular/router';
import { PaymentService } from '../payment.service';
import { CommonUtil } from '../../shared/CommonUtil';
import { Cart } from '../../cart/model/cart';
import { MatButtonModule } from '@angular/material/button';
import { RazorPayOrder } from '../model/razor-pay-order';
import { Payment } from '../model/payment';
import { RECEIPT_ID } from '../../app.constants';

import { Subscription, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { L } from '@angular/cdk/keycodes';

declare const Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  util: CommonUtil = new CommonUtil();
  cart: Cart;
  userEmail: string;
  userName: string;
  createOrderSubscription: Subscription;
  savePaymentSubscription: Subscription;

  loadingOrder = false;

  RAZORPAY_OPTIONS = {
    key: '',
    amount: 0,
    currency: '',
    name: '',
    description: '',
    image: 'https://lng-images.s3.amazonaws.com/pexels-pixabay-247819.jpg',
    order_id: '',
    handler: (res: any) => {
      //console.log(res);
      alert(res.razorpay_payment_id);
      alert(res.razorpay_order_id);
      alert(res.razorpay_signature);
    },
    prefill: {
      name: '',
      email: '',
      contact: '',
    },
    notes: {
      address: 'NA',
    },
    theme: {
      color: '#4285F4',
    },
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router,
    private zone: NgZone
  ) {
    this.cart = this.cartService.getCart();
    this.authService.getUserEmail().then((email) => (this.userEmail = email));
    this.authService.getUserFullname().then((name) => (this.userName = name));
  }

  ngOnInit(): void {
    if (
      this.cart == null ||
      this.cart.items == null ||
      this.cart.items.length == 0
    ) {
      this.router.navigate(['/cart']);
    }

    const script: HTMLScriptElement = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);

    const order: RazorPayOrder = new RazorPayOrder(
      // this.cart.grandTotal,
      this.cart.total * 100,
      'INR',
      'NA'
    );

    window.scrollTo({ top: 0, behavior: 'auto' });

    this.loadingOrder = true;
    this.createOrderSubscription = this.paymentService
      .createOrder(order)
      .pipe(
        catchError((err) => {
          console.error('Error creating order - ' + err);
          return of(null);
        })
      )
      .subscribe((res) => {
        this.loadingOrder = false;
        if (res != null) {
          this.RAZORPAY_OPTIONS.order_id = res.orderId;
          // return;
        } else {
          this.router.navigate(['/cart']);
        }
      });
  }

  payWithRazorPay() {
    if (this.userEmail == undefined) {
      this.authService.signIn();
    } else {
      this.RAZORPAY_OPTIONS.name = this.userName;
      this.RAZORPAY_OPTIONS.key = environment.razorPay.key;
      this.RAZORPAY_OPTIONS.amount = this.cart.total;
      this.RAZORPAY_OPTIONS.currency = 'INR';

      let items = '';
      for (let i = 0; i < this.cart.items.length; i++) {
        items += this.cart.items[i].name;
      }
      this.RAZORPAY_OPTIONS.description = items;

      this.RAZORPAY_OPTIONS.prefill.name = this.userName;
      this.RAZORPAY_OPTIONS.prefill.email = this.userEmail;
      // this.RAZORPAY_OPTIONS.prefill.contact = this.user.phoneNumber;

      this.RAZORPAY_OPTIONS.handler = this.razorPaySuccessHandler.bind(this);
      const razorPay = new Razorpay(this.RAZORPAY_OPTIONS);
      razorPay.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      razorPay.open();
    }
  }

  razorPaySuccessHandler(response: any) {
    console.log(response);
    const payment: Payment = new Payment();
    payment.orderId = response.razorpay_order_id;
    payment.signature = response.razorpay_signature;
    payment.paymentId = response.razorpay_payment_id;
    payment.currency = this.RAZORPAY_OPTIONS.currency;

    payment.cartId = this.cart.id;
    payment.items = this.cart.items;
    payment.total = this.cart.total;
    // payment.tax = this.cart.tax;
    // payment.grandTotal = this.cart.grandTotal;

    // payment.userId = this.user.id;
    payment.userName = this.userName;
    payment.email = this.userEmail;

    console.log(payment);
    this.savePaymentSubscription = this.paymentService
      .savePaymentDetails(payment)
      .subscribe((res) => {
        if (res.status == 200) {
          this.cartService.removeCart();
          localStorage.setItem(RECEIPT_ID, this.util.Encrypt(res.body));
          this.zone.run(() => this.router.navigate(['../payment', 'receipt']));
        }
      });
  }

  ngOnDestroy(): void {
    this.createOrderSubscription?.unsubscribe();
    this.savePaymentSubscription?.unsubscribe();
  }
}
