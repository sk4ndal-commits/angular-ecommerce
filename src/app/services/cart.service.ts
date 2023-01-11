import { Injectable } from '@angular/core';
import {BehaviorSubject, ReplaySubject, Subject} from "rxjs";
import {CartItem} from "../common/cart-item";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  storage: Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(cartItemToAdd: CartItem) {
    let existingCartItem = this.cartItems.find(carItem => carItem.id === cartItemToAdd.id);
    let alreadyInCart = existingCartItem != undefined;

    if (!alreadyInCart) {
      this.cartItems.push(cartItemToAdd);
    }
    else {
      // @ts-ignore
      existingCartItem.quantity++;
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let sumPrice: number = 0;
    let sumQuantity: number = 0;

    for (let cartItem of this.cartItems) {
      sumPrice += cartItem.unitPrice * cartItem.quantity;
      sumQuantity += cartItem.quantity;
    }

    this.totalPrice.next(sumPrice);
    this.totalQuantity.next(sumQuantity);

    this.persistCartItems();
  }

  decrementQuantity(cartItem: CartItem) {
    let itemToDecrement: CartItem = this.cartItems.find(item => item.id === cartItem.id)!;

    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    this.cartItems = this.cartItems.filter(item => item.id != cartItem.id);
    this.computeCartTotals();
  }
}
