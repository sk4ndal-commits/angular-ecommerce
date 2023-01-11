import { Component, OnInit } from '@angular/core';
import {OrderHistoryService} from "../../services/order-history.service";
import {OrderHistory} from "../../common/order-history";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  storage: Storage = sessionStorage;
  orderHistories: OrderHistory[] = [];

  constructor(private orderService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  private handleOrderHistory() {
    const email = JSON.parse(this.storage.getItem('userEmail')!);

    this.orderService.getOrderHistory(email).subscribe(
      data => this.orderHistories = data.sort((a: any, b: any) => {
        return a.dateCreated.getTime() - b.dateCreated.getTime();
      })
    )
  }
}
