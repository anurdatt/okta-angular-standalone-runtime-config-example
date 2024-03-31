import { Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { OktaAuthGuard } from '@okta/okta-angular';
import { BlogViewComponent } from './blog-view/blog-view.component';
import { postResolver } from './post.resolver';
import { postsResolver } from './posts.resolver';

export const BLOG_ROUTES: Routes = [
  // { path: '', redirectTo: 'blog-list', pathMatch: 'full' },
  {
    path: '',
    component: BlogListComponent,
    pathMatch: 'full',
    resolve: {
      posts: postsResolver,
    },
  },
  // {
  //   path: 'blog-list',
  //   component: BlogListComponent,
  // },
  {
    path: 'blog-edit/:id',
    canActivate: [OktaAuthGuard],
    component: BlogEditComponent,
  },
  {
    path: 'blog-view/:id',
    component: BlogViewComponent,
    resolve: {
      post: postResolver,
    },
  },
];
