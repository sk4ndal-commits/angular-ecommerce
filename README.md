# AngularEcommerce

This application was part of a Udemy course.

## Features

- Loads product list from database
- Add items to your cart (saved in sessionsStorage such that site refresh does not empty your cart)
- Add or remove items from your cart
- Checkout, fill in information for the payment process (handled via Stripe)
- User login via Okta+Oauth2+OpenID; Once logged in, users can see previous order history and access membership only content
- Filter and search functions such as different product categories

## Technologies Used

- Angular
- Okta
- Stripe
- Bootstrap

## Things Learned

- Securing routes with Okta
- Handle payments via Stripe integration
- Application and Code design
- Ease of use of bootstrap


## Issues

The user login hangs in an infinite loop after pressing the ``Anmelden`` button. No error messages occur, all configurations
on the Okta-server-side and the client are correct, all entities necessary to succeed the operation are correctly defined.
No errors in the Okta-application-dashboard. The Okta sign in widget uses callback function on login which are never called.
It seems to be a problem on the Okta-server side.

## Future Work

- Add tests and fuzzing


## Images

