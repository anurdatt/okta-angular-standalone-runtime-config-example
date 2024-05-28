import { Routes } from '@angular/router';
import { CourseViewComponent } from './course-view/course-view.component';
import { OktaAuthGuard } from '@okta/okta-angular';
import { courseResolver } from './course.resolver';
import { CoursePlayComponent } from './course-play/course-play.component';
import { CoursesViewComponent } from './courses-view/courses-view.component';
import { UrlCoursePlayComponent } from './url-course-play/url-course-play.component';
import { urlCourseResolver } from './url-course.resolver';
import { UrlVideoCoursePlayerComponent } from './url-course-play/url-video-course-player.component';
import { UrlVideoPlayerComponent } from './url-course-play/url-video-player.component';
import { urlLessonResolver } from './url-lesson.resolver';

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
  {
    path: ':url',
    component: CourseViewComponent,
    resolve: {
      course: urlCourseResolver,
    },
  },
  {
    path: ':url/lessons',
    component: UrlCoursePlayComponent,
    resolve: {
      course: urlCourseResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UrlVideoPlayerComponent,
        data: {
          lesson: {},
        },
      },
      {
        path: ':id',
        component: UrlVideoPlayerComponent,
        resolve: {
          lesson: urlLessonResolver,
        },
      },
    ],
  },
];
