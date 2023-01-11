import {Component, Inject, OnInit} from '@angular/core';
import myAppConfig from "../../config/my-app-config";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
// @ts-ignore
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
    });

  }

  ngOnInit(): void {
    this.oktaSignIn.remove();

    /**
     * Render the sign in widget to an element. Returns a promise that will resolve on success or reject on error.
     * @param options - options for the signin widget.
     *        Must have an el or $el property to render the widget to.
     * @param success - success callback function
     * @param error - error callback function
     */
    this.oktaSignIn.renderEl(
      {el: '#okta-sign-in-widget'},
      (response: any) => {
        console.log(`response: ${response}`);
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (err: any) => {
        console.log(`error: ${err}`);
        throw err;
      }
    );

  }
}
