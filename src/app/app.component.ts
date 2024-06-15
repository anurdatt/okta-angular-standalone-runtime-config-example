import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';
import { Subscription, filter, map } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TrackScrollDirective } from './shared/scroll/track-scroll.directive';
import { ScrollService } from './shared/scroll/scroll.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CartService } from './cart/cart.service';
import { Cart } from './cart/model/cart';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    // AuthModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    TrackScrollDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private oktaStateService = inject(OktaAuthStateService);
  private oktaAuth = inject(OKTA_AUTH);

  routerEventSubscription: Subscription;
  breakpointSubscription: Subscription;

  handsetPortrait = false;
  public isAuthenticated$ = this.oktaStateService.authState$.pipe(
    filter((s: AuthState) => !!s),
    map((s: AuthState) => s.isAuthenticated ?? false)
  );

  loading: boolean = false;
  isSubMenuOpen = false;

  cart: Cart | undefined;

  hideGeneralMenu = false;

  constructor(
    private router: Router,
    private scrollService: ScrollService,
    private responsive: BreakpointObserver,
    private cartService: CartService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
        if (this.router.url.endsWith('payment/checkout')) {
          this.hideGeneralMenu = true;
        } else {
          this.hideGeneralMenu = false;
        }
      }
    });

    cartService.cartChanged$.asObservable().subscribe((changed) => {
      if (changed) this.cart = cartService.getCart();
    });
    this.cart = cartService.getCart();

    matIconRegistry.addSvgIconSet(
      // 'youtube',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icons.svg')
    );

    matIconRegistry.addSvgIcon(
      'linkedin',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg')
    );
  }

  @HostListener('window:scroll', ['$event'])
  OnScroll($event: any) {
    // console.log('Scroll event : ' + JSON.stringify($event));
    // console.log('window scrol top = ' + window.scrollY);
    this.scrollService.scrollPosition$.next(window.scrollY);
  }

  ngOnInit(): void {
    this.breakpointSubscription = this.responsive
      .observe([
        Breakpoints.TabletPortrait,
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait,
      ])
      .subscribe((result) => {
        this.handsetPortrait = false;
        if (result.matches) {
          this.handsetPortrait = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.routerEventSubscription?.unsubscribe();
    this.breakpointSubscription?.unsubscribe();
  }

  public async signIn(): Promise<void> {
    await this.oktaAuth.signInWithRedirect({
      originalUri: this.router.url, //'/login',
      // redirectUri: this.router.url,
    });
  }

  public async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}
