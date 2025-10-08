import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe} from "@angular/common";
import { ProductPreloadService } from 'src/app/services/product-preload.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  imports: [
    NgbPagination,
    RouterLink,
    CurrencyPipe
  ],
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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private productPreloadService: ProductPreloadService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currentCategoryId)
      .subscribe(
      this.processResult()
    );
  }

  handleSearchProducts() {
    const keyWord: string = this.route.snapshot.paramMap.get("keyword")!;

    if (this.previousKeyword != keyWord) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyWord;

    this.productService.searchProductsPaginate(keyWord, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  updatePageSize(newSize: string) {
    this.pageSize = +newSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  private processResult() {
    return (data: any) => {
      this.products = data.content;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
    };
  }

  addToCart(tProd: Product) {
    this.cartService.addToCart(new CartItem(tProd));
  }

  preloadProduct(product: Product) {
    this.productPreloadService.setProduct(product);
  }
}
