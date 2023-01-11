import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousCategoryId: number = 1;
  previousKeyword: string = "";

  previuousCartQuantity: number = 0;
  previuousCartPrice: number = 0;


  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {this.listProducts()});
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
    }
    else {
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber-1, this.pageSize, this.currentCategoryId).subscribe(
      this.processResult()
    );
  }

  handleSearchProducts() {
    const keyWord: string = this.route.snapshot.paramMap.get("keyword")!;

    if (this.previousKeyword != keyWord) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyWord;

    this.productService.searchProductsPaginate(keyWord, this.pageNumber-1, this.pageSize).subscribe(this.processResult());
  }

  updatePageSize(newSize: string) {
    this.pageSize = +newSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number+1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  addToCart(tProd: Product) {
    this.cartService.addToCart(new CartItem(tProd));
  }
}
