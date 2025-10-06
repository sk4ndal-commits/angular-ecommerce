import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  standalone: true,
  imports: [
    RouterLink
  ],
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
              private oktaAuthService: OktaAuthStateService) { }

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  private getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(

        (res) => {

          this.userFullName = res.name as string;
          this.storage.setItem('userEmail', JSON.stringify(res.email));
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
