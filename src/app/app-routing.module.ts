import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {CartDetailsComponent} from "./components/cart-details/cart-details.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {MembersPageComponent} from './components/members-page/members-page.component';
import {OrderHistoryComponent} from "./components/order-history/order-history.component";

const routes: Routes = [
  {path: 'members', component: MembersPageComponent},
  {path: 'category/:id/:name', component: ProductListComponent},
  {path: 'order-history', component: OrderHistoryComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
