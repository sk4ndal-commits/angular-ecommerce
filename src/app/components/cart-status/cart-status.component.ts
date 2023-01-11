import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
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
