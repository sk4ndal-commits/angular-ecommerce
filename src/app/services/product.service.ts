import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environment.luv2shopApiUrl +'/products';
  private categoryUrl: string = environment.luv2shopApiUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetProducts> {
    const url = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetProducts>(url);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetCategories>(this.categoryUrl).pipe(
      map(res => res._embedded.productCategory)
    );
  }

  searchProductsPaginate(keyWord: string, thePage: number, theSize: number): Observable<GetProducts> {
    const url = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}&page=${thePage}&size=${theSize}`;
    return this.httpClient.get<GetProducts>(url);
  }

  getProduct(id: number): Observable<Product> {
    const url: string = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Product>(url);
  }

}

interface GetProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  }
}

interface GetCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
