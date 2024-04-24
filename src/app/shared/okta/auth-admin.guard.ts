import { ActivatedRouteSnapshot, CanMatch, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { Inject, Injectable, Injector } from "@angular/core";
import { OKTA_AUTH, OktaAuthConfigService, OktaAuthGuard } from "@okta/okta-angular";
import OktaAuth, { CustomUserClaim } from "@okta/okta-auth-js";

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard extends OktaAuthGuard{
  
  constructor(@Inject(OKTA_AUTH) private oktaAuth1: OktaAuth,
    injector: Injector,
    private router: Router,
    private configService1: OktaAuthConfigService) {
    super(oktaAuth1, injector, configService1);
  }

  async canMatch(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Check if the user is authenticated
    console.log('Checking for AuthN in AuthGuard..');
    if (!(await super.canActivate(route, state))) {
      return false;
    }
    //authorization
    else {
      console.log('Checking for AuthZ in AuthGuard..');
      const userClaims = await this.oktaAuth1.getUser();
      let groups: string[] = userClaims['Groups'] as string[]; 
      if (groups.find(role => role == AuthService.adminSearchString) == AuthService.adminSearchString) {
        return true;
      } else {
        this.router.navigate(['/unauthorize']);
        return false;
      }
    }
  }
}
