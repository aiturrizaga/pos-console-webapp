import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Keycloak from 'keycloak-js';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized-page',
  imports: [
    RouterLink,
    ButtonModule
  ],
  templateUrl: './unauthorized-page.html',
  styles: ``,
})
export class UnauthorizedPage implements OnInit {
  returnUrl = signal<string | null>(null);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #keycloak = inject(Keycloak);

  ngOnInit(): void {
    const returnUrl = this.#route.snapshot.queryParamMap.get('returnUrl');
    this.returnUrl.set(returnUrl);
    this.goBack();
  }

  logout(): void {
    this.#keycloak.logout({
      redirectUri: window.location.origin
    }).then();
  }

  goBack(): void {
    if (this.returnUrl) {
      this.#router.navigateByUrl(this.returnUrl()!).then();
    }
  }

}
