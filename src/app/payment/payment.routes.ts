import { Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';

export const PAYMENT_ROUTES: Routes = [
  { path: '', redirectTo: 'checkout', pathMatch: 'full' },
  {
    path: 'checkout',
    component: CheckoutComponent,
    pathMatch: 'full',
    // resolve: {
    //   postWithTagsList: postsResolver,
    // },
  },
  // {
  //   path: 'blog-edit/:url',
  //   canMatch: [AuthAdminGuard], //[OktaAuthGuard],
  //   component: BlogEditComponent,
  // },
];
