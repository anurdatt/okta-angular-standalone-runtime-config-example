import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from './model/cart';
import { CommonUtil } from '../shared/CommonUtil';
import { CartItem } from './model/cart-item';
import { CART_ID } from '../app.constants';

const headers = new HttpHeaders()
  .set('Accept', '*/*')
  .set('content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart;

  util: CommonUtil = new CommonUtil();

  cartChanged$: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.cart = new Cart();
    this.cartChanged$ = new BehaviorSubject(false);
  }

  private calculate(): void {
    this.cart.total = 0;
    this.cart.items.forEach((x) => {
      this.cart.total += x.unitPrice * x.quantity;
    });
    this.cart.tax = Math.round((this.cart.total * this.cart.taxRate) / 100);
    this.cart.grandTotal = this.cart.total + this.cart.tax;

    //save cart
    this.saveCart();
  }
  private saveCart(): void {
    // if (!this.cart.id) this.cart.id = this.cart.getCartId();
    const data = this.util.Encrypt(this.cart);
    localStorage.setItem(this.cart.id, data);
  }

  addToCart(
    itemId: number,
    itemUrl: string,
    name: string,
    imageUrl: string,
    unitPrice: number,
    quantity: number
  ): void {
    const index = this.cart.items.findIndex((x) => x.itemId === itemId);
    if (index === -1) {
      const item: CartItem = new CartItem(
        itemId,
        itemUrl,
        name,
        imageUrl,
        unitPrice,
        quantity
      );
      this.cart.items.push(item);
    }
    // else{
    //   this.cart.items[index].quantity += quantity;
    // }
    this.calculate();
    this.cartChanged$.next(true);
  }
  deleteItem(itemId: number): void {
    const index = this.cart.items.findIndex((x) => x.itemId === itemId);
    if (index !== -1) {
      this.cart.items.splice(index, 1);
      this.calculate();
      this.cartChanged$.next(true);
    }
  }

  getCart(): Cart {
    console.log('In GetCart() - cartt = ', this.cart);
    const data = localStorage.getItem(this.cart.id);
    if (data != null) {
      this.cart = this.util.Decrypt(data);
    }
    return this.cart;
  }

  isCartContainsCourse(courseId: number): boolean {
    if (this.cart.items.findIndex((item) => item.itemId == courseId) >= 0)
      return true;
    else return false;
  }

  removeCart(): void {
    localStorage.removeItem(this.cart.id);
    localStorage.removeItem(CART_ID);
    this.cart = new Cart();
    this.cartChanged$.next(true);
  }
  saveCartToDB(cart: Cart): Observable<any> {
    this.cart.userId = cart.userId;
    this.saveCart();
    return this.http.post<any>(
      environment.coursesApiUrl + '/api/cart/savecart',
      JSON.stringify(this.cart),
      { headers: headers, observe: 'response' }
    );
  }
}
