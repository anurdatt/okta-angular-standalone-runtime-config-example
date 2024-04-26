import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth, {
  AuthState,
  CustomUserClaim,
  IDToken,
} from '@okta/okta-auth-js';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, filter, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  public static adminSearchString: string = 'SuperUser';

  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  private userGroupsSubject: BehaviorSubject<
    CustomUserClaim[] | CustomUserClaim
  > = new BehaviorSubject<CustomUserClaim[] | CustomUserClaim>([]);
  userGroups$: Observable<CustomUserClaim[] | CustomUserClaim> =
    this.userGroupsSubject.asObservable();

  authenticatedSubscription: Subscription;
  groupsSubscription: Subscription = null;

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private oktaAuthStateService: OktaAuthStateService,
    private router: Router
  ) {
    // Update the state when authentication changes
    this.authenticatedSubscription =
      this.oktaAuthStateService.authState$.subscribe((authState: AuthState) => {
        this.isAuthenticatedSubject.next(authState.isAuthenticated);
        if (authState.isAuthenticated) {
          //Approach 1 - Get Groups observer from oktaAuth.getUser
          if (this.groupsSubscription != null)
            this.groupsSubscription.unsubscribe();
          this.groupsSubscription = new Observable((observer) => {
            setTimeout(async () => {
              observer.next((await this.oktaAuth.getUser())['Groups'] || []);
              observer.complete();
            }, 1000);
          })
            // // Approach 2 - Get groups observer from authState.idToken
            // this.getUserGroups()
            //   // new Observable((observer) => {
            //   //   setTimeout(async () => {
            //   //     observer.next(authState.idToken);
            //   //     observer.complete();
            //   //   }, 1000);
            //   // })
            //   //   .pipe(
            //   //     switchMap((idToken: IDToken) => {
            //   //       const groupsClaim: CustomUserClaim[] | CustomUserClaim =
            //   //         idToken.claims['Groups'];
            //   //       console.log({ groupsClaim });
            //   //       const claims: CustomUserClaim[] = Array.isArray(groupsClaim)
            //   //         ? groupsClaim
            //   //         : [groupsClaim];
            //   //       console.log({ claims });
            //   //       return claims;
            //   //     })
            //   //   )
            .subscribe((groups: CustomUserClaim[] | CustomUserClaim) => {
              // console.log({ gc: groups });
              this.userGroupsSubject.next(groups);
            });
        } else {
          // Clear user groups when not authenticated
          this.userGroupsSubject.next([]);
        }
      });
  }
  ngOnDestroy(): void {
    this.authenticatedSubscription.unsubscribe();
    if (this.groupsSubscription != null) this.groupsSubscription.unsubscribe();
  }

  // private getIdToken(): Observable<any> {
  //   return this.oktaAuthStateService.authState$.pipe(filter((auth) => !!auth));
  // }

  // private getUserGroups(): Observable<string[]> {
  //   return this.getIdToken().pipe(
  //     switchMap((auth) => {
  //       const groupsClaim = auth.idToken.claims['Groups'] || [];
  //       return Array.isArray(groupsClaim) ? groupsClaim : [groupsClaim];
  //     }),
  //     tap((groups: string[]) => {
  //       console.log({ grp: groups });
  //       return groups.reduce((acc, group) => acc.concat(group), []);
  //     })
  //   );
  // }

  isAdmin(groups): boolean {
    // console.log({ groups });
    if (Array.isArray(groups)) {
      return groups.includes(AuthService.adminSearchString);
    } else {
      // Handle the case where it's a single value, not an array
      return groups === AuthService.adminSearchString;
    }
  }

  public async signIn(): Promise<void> {
    // await this.oktaAuth.signInWithRedirect();

    // Store the current route in session storage
    // sessionStorage.setItem('returnUrl', this.router.url);

    // Redirect to Okta login page with state parameter
    // const state = { targetUrl: this.router.url };
    await this.oktaAuth.signInWithRedirect({
      originalUri: this.router.url, //'/login',
      // redirectUri: this.router.url,
    });
  }

  public async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }

  public async getUserFullname(): Promise<string> {
    return (await this.oktaAuth.getUser()).name;
  }

  public async getUserProfileUrl(): Promise<string> {
    return (await this.oktaAuth.getUser())['profile']?.toString();
  }
}
