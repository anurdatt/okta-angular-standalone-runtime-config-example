import { Injectable } from '@angular/core';
import { RazorPayOrder } from './model/razor-pay-order';

import { Observable } from 'rxjs';
import { Payment } from './model/payment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createOrder(order: RazorPayOrder): Observable<any> {
    // return new Observable((obs) => {
    //   setTimeout(() => {
    //     obs.next({
    //       status: 200,
    //       body: { orderId: 'order_OMZHetnVA9ZZo5' },
    //     });
    //     obs.complete();
    //   }, 500);
    // });
    return this.http.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: order.grandTotal,
        currency: order.currency,
        receipt: order.receipt,
      },
      {
        headers: new HttpHeaders()
          .append(
            'Authorization',
            'Basic cnpwX3Rlc3RfV2FOMjhNVkFZMDRHcnc6T0ZCS00wRFhtaEpIWDRrT2d0YlJyaUt1'
          )
          .append('Content-Type', 'application/json'),
      }
    );
  }

  savePaymentDetails(payment: Payment): Observable<any> {
    return new Observable((obs) => {
      setTimeout(() => {
        obs.next({
          status: 200,
          body: { receipt: 'receipt_' + payment.paymentId },
        });
        obs.complete();
      }, 500);
    });
  }
}
