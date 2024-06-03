import { Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { OktaAuthGuard } from '@okta/okta-angular';
import { BlogViewComponent } from './blog-view/blog-view.component';
import { postResolver } from './post.resolver';
import { postsResolver } from './posts.resolver';
import { BlogsViewComponent } from './blogs-view/blogs-view.component';
import { AuthAdminGuard } from '../shared/okta/auth-admin.guard';

export const BLOG_ROUTES: Routes = [
  // { path: '', redirectTo: 'blog-list', pathMatch: 'full' },
  {
    path: '',
    component: BlogsViewComponent,
    pathMatch: 'full',
    resolve: {
      postWithTagsList: postsResolver,
    },
  },
  // {
  //   path: 'blog-list',
  //   component: BlogListComponent,
  // },
  {
    path: 'blog-edit/:url',
    canMatch: [AuthAdminGuard], //[OktaAuthGuard],
    component: BlogEditComponent,
  },
  {
    path: 'blog-view/:url',
    component: BlogViewComponent,
    resolve: {
      postWithTagsList: postResolver,
    },
  },
];
