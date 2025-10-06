import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CurrencyPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  styleUrls: ['./cart-status.component.scss']
})
export class CartStatusComponent implements OnInit {

  cartPrice: number = 0;
  numItems: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus() {
    this.cartService.totalPrice.subscribe(
      data => {
        this.cartPrice = data.valueOf();
      }
    )
    this.cartService.totalQuantity.subscribe(
      data => {
        this.numItems = data.valueOf();
      }
    )
  }
}
