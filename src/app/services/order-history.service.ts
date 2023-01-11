import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {OrderHistory} from "../common/order-history";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private baseUrl: string = environment.luv2shopApiUrl + '/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: String): Observable<OrderHistory[]> {
    const url = `${this.baseUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;

    return this.httpClient.get<GetOrderHistory>(url).pipe(
      map(res => res._embedded.orders)
    );
  }
}

interface GetOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
