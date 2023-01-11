import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CartService} from "../../services/cart.service";
import {Luv2ShopFormServiceService} from "../../services/luv2-shop-form-service.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {Customer} from "../../common/customer";
import {Address} from "../../common/address";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/payment-info";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];
  storage: Storage = sessionStorage;
  // @ts-ignore
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any;
  isDisabled = false;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private luv2shopService: Luv2ShopFormServiceService,
              private checkoutService: CheckoutService,
              private router: Router) {}

  ngOnInit(): void {
    this.createCheckoutForm();
    this.setupStripePaymentForm();
    this.getCartTotals();
    this.getCountries();
  }


  getCountries() {
    this.luv2shopService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );
  }

  getCartTotals() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  createCheckoutForm() {
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]) ,
        lastName: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl(
          theEmail,
          [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      }),

      shippingAddress: this.formBuilder.group({
        country: new FormControl(
          '',
          [Validators.required]
        ),
        street: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
        city: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
        state: new FormControl(
          '',
          Validators.required
        ),
        zipCode: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
      }),

      billingAddress: this.formBuilder.group({
        country: new FormControl(
          '',
          Validators.required
        ),
        street: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
        city: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
        state: new FormControl(
          '',
          Validators.required
        ),
        zipCode: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]
        ),
      }),
    });
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order(this.totalQuantity, this.totalPrice);

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    let customer = new Customer(
      this.firstName.value,
      this.lastName.value,
      this.email.value
    );

    let shippingAddress = new Address(
      this.shippingStreet.value,
      this.shippingCity.value,
      this.shippingState.value.name,
      this.shippingCountry.value.name,
      this.shippingZipcode.value
    );

    let billingAddress = new Address(
      this.billingStreet.value,
      this.billingCity.value,
      this.billingState.value.name,
      this.billingCountry.value.name,
      this.billingZipcode.value
    );

    let purchase: Purchase = new Purchase(
      customer,
      shippingAddress,
      billingAddress,
      order,
      orderItems
    );

    this.paymentInfo.currency = 'USD';
    this.paymentInfo.amount = Math.round(this.totalPrice*100);

    this.paymentInfo.receiptEmail = purchase.customer.email;

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === '') {
      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
              payment_method: {
                card: this.cardElement,

                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,

                  address: {
                    line1: purchase.billingAddress.street,
                    city:purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipcode,
                    country: this.billingCountry.value.code
                  }

                }
              }
            }, {handleActions: false}
          ).then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              }
              else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\n Your tracking number: ${response.orderTrackingNumber}`);
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
          })
        }
      );
    }
    else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  billEquShipAddress(event: any) {
    if (event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingStates = this.shippingStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates = [];
    }
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName)!;
    const countryCode = formGroup.value.country.code!;

    this.luv2shopService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingStates = data;
        }
        else {
          this.billingStates = data;
        }

        formGroup.get('state')!.setValue(data[0]);
      }
    );
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName')!;}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName')!;}
  get email() {return this.checkoutFormGroup.get('customer.email')!;}

  get shippingStreet() {return this.checkoutFormGroup.get('shippingAddress.street')!;}
  get shippingCountry() {return this.checkoutFormGroup.get('shippingAddress.country')!;}
  get shippingState() {return this.checkoutFormGroup.get('shippingAddress.state')!;}
  get shippingCity() {return this.checkoutFormGroup.get('shippingAddress.city')!;}
  get shippingZipcode() {return this.checkoutFormGroup.get('shippingAddress.zipCode')!;}

  get billingStreet() {return this.checkoutFormGroup.get('billingAddress.street')!;}
  get billingCountry() {return this.checkoutFormGroup.get('billingAddress.country')!;}
  get billingState() {return this.checkoutFormGroup.get('billingAddress.state')!;}
  get billingCity() {return this.checkoutFormGroup.get('billingAddress.city')!;}
  get billingZipcode() {return this.checkoutFormGroup.get('billingAddress.zipCode')!;}

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);

    this.checkoutFormGroup.reset();

    this.cartService.persistCartItems();

    this.router.navigateByUrl("/products");
  }

  private setupStripePaymentForm() {
    const elements = this.stripe.elements();

    this.cardElement = elements.create('card', {hidePostalCode: true});
    this.cardElement.mount('#card-element')

    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.text = '';
      }
      else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }
}
