import { Component } from '@angular/core';
import {
  ProductCategoryMenuComponent
} from "./components/product-category-menu/product-category-menu.component";
import {SearchComponent} from "./components/search/search.component";
import {
  CartStatusComponent
} from "./components/cart-status/cart-status.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    ProductCategoryMenuComponent,
    SearchComponent,
    CartStatusComponent,
    RouterOutlet
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-ecommerce';
}
