import { Injectable } from '@angular/core';
import { RazorPayOrder } from './model/razor-pay-order';

import { Observable } from 'rxjs';
import { Payment } from './model/payment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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

    const url = environment.apiUrl + '/api/payments/create-order';
    return this.http.post(
      url,
      {
        amount: order.grandTotal,
        currency: order.currency,
        receipt: order.receipt,
      },
      {
        headers: new HttpHeaders().append('Content-Type', 'application/json'),
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
