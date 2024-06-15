export class CartItem {
  id?: number;
  total: number = 0;
  constructor(
    public itemId: number,
    public itemUrl: string,
    public name: string,
    public imageUrl: string,
    public unitPrice: number,
    public quantity: number
  ) {}
}
