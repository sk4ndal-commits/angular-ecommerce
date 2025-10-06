import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./product-category-menu.component.scss']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    )
  }

}
