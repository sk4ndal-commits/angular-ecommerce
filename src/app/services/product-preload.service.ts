import { Injectable } from '@angular/core';
import { Product } from '../common/product';

@Injectable({ providedIn: 'root' })
export class ProductPreloadService {
  private preloadedProduct: Product | undefined;

  setProduct(product: Product) {
    this.preloadedProduct = product;
  }

  getProduct(): Product | undefined {
    return this.preloadedProduct;
  }

  clearProduct() {
    this.preloadedProduct = undefined;
  }
}

