import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDeatils();
    })
  }

  handleProductDeatils() {
    const id: number = +this.route.snapshot.paramMap.get("id")!;
    this.productService.getProduct(id).subscribe(
      data => {
        this.product = data;
      }
    );
  }

  addToCart() {
    this.cartService.addToCart(new CartItem(this.product));
  }

}
