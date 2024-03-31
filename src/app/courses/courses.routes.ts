import { Routes } from '@angular/router';
import { CourseViewComponent } from './course-view/course-view.component';
import { OktaAuthGuard } from '@okta/okta-angular';
import { courseResolver } from './course.resolver';
import { CoursePlayComponent } from './course-play/course-play.component';
import { CoursesViewComponent } from './courses-view/courses-view.component';

export const COURSE_ROUTES: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: CoursesViewComponent, pathMatch: 'full' },
  {
    path: 'course-view/:id',
    // canActivate: [OktaAuthGuard],
    component: CourseViewComponent,
    resolve: {
      course: courseResolver,
    },
  },
  {
    path: 'course-play',
    component: CoursePlayComponent,
  },
];
