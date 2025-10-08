import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";
import {CurrencyPipe} from "@angular/common";
import { ProductPreloadService } from 'src/app/services/product-preload.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product?: Product | undefined;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private productPreloadService: ProductPreloadService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    const id: number = +this.route.snapshot.paramMap.get("id")!;
    const preloaded = this.productPreloadService.getProduct();
    if (preloaded && Number(preloaded.id) == id) {
      this.product = preloaded;
      this.productPreloadService.clearProduct();
    } else {
      this.productService.getProduct(id).subscribe(
        data => {
          this.product = data;
        }
      );
    }
  }

  addToCart() {
    if (this.product) this.cartService.addToCart(new CartItem(this.product));
  }

}
