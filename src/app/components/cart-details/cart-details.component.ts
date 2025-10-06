import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";
import {CurrencyPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartItems();
  }

  listCartItems() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.computeCartTotals();
  }

  addItem(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
    this.listCartItems();
  }

  remove(cartItem: CartItem) {
    this.cartService.remove(cartItem);
    this.listCartItems();
  }
}
