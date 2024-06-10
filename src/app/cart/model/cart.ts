import { CartItem } from './cart-item';
import { CART_ID } from '../../app.constants';
import { environment } from '../../../environments/environment';

export class Cart {
  id: string;
  items: CartItem[];
  total: number;
  tax: number;
  taxRate: number;
  grandTotal: number;
  userId: string;
  createdDate?: string;
  constructor() {
    this.id = this.getCartId();
    this.userId = '';
    this.items = [];
    this.total = 0;
    this.tax = 0;
    this.grandTotal = 0;
    this.taxRate = environment.taxRate;
  }
  getCartId(): string {
    const cid = localStorage.getItem(CART_ID);
    if (cid) {
      return cid;
    } else {
      const cartId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
      localStorage.setItem(CART_ID, cartId);
      return cartId;
    }
  }
}
