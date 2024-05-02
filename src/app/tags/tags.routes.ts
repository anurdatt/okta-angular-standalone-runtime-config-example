import { Routes } from '@angular/router';
import { TagsComponent } from './tags.component';
// import { TagEditComponent } from './tag-edit/tag-edit.component';
import { OktaAuthGuard } from '@okta/okta-angular';
import { AuthAdminGuard } from '../shared/okta/auth-admin.guard';
import { AllTagsViewComponent } from './all-tags-view/all-tags-view.component';
import { TagViewComponent } from './tag-view/tag-view.component';

export const TAG_ROUTES: Routes = [
  {
    path: '',
    component: TagsComponent,
    // pathMatch: 'prefix',
    // resolve: {
    //   postWithTagsList: postsResolver,
    // },
    children: [
      { path: '', pathMatch: 'full', component: AllTagsViewComponent },
      { path: ':id', component: TagViewComponent },
    ],
  },
  // {
  //   path: 'tag-edit/:id',
  //   canMatch: [AuthAdminGuard], //[OktaAuthGuard],
  //   component: TagEditComponent,
  // }

  // {
  //   path: 'blog-view/:id',
  //   component: BlogViewComponent,
  //   resolve: {
  //     postWithTags: postResolver,
  //   },
  // },
];
