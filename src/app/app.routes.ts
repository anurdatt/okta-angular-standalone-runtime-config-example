// import { Routes } from '@angular/router';
// import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
// import { ProfileComponent } from './profile/profile.component';

// export const routes: Routes = [
//   { path: 'profile', component: ProfileComponent, canActivate: [OktaAuthGuard] },
//   { path: 'protected', loadChildren: () => import('./protected/routes').then(m => m.PROTECTED_FEATURE_ROUTES), canActivate: [OktaAuthGuard] },
//   { path: 'login/callback', component: OktaCallbackComponent }
// ];

import { Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TagsComponent } from './tags/tags.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { UnauthorizeComponent } from './unauthorize/unauthorize.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'callback',
    component: OktaCallbackComponent,
  },
  {
    path: 'notes',
    canActivate: [OktaAuthGuard],
    loadChildren: () =>
      import('./notes/notes.routes').then((mod) => mod.NOTE_ROUTES),
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'blogs',
    // canActivate: [OktaAuthGuard],
    loadChildren: () =>
      import('./blogs/blogs.routes').then((mod) => mod.BLOG_ROUTES),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.routes').then((mod) => mod.COURSE_ROUTES),
  },
  {
    path: 'all-topics',
    component: TagsComponent,
  },
  {
    path: 'tag/:id',
    component: TagsComponent,
  },
  {
    path: 'notfound',
    component: NotfoundComponent,
  },
  {
    path: 'unauthorize',
    component: UnauthorizeComponent,
  },
  {
    path: '**',
    component: NotfoundComponent, //redirectTo: 'notfound'
  },
];
