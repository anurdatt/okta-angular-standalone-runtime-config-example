import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, catchError, of as observableOf } from 'rxjs';
import { CoursesService } from './courses.service';
import { Lesson } from './model/lesson';

export function urlLessonsResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<Lesson[]> {
  const service: CoursesService = inject(CoursesService);

  // console.log(
  //   "In lessons resolver - route.params['url'] = " + route.params['url']
  // );

  return service.findlessonsByUrl(route.params['url']).pipe(
    catchError((err) => {
      console.error('In Lessons resolver - catchError, err = ');
      console.error({ err });
      return observableOf(null);
    })
  );
}
