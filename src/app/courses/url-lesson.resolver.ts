import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, catchError, of as observableOf } from 'rxjs';
import { Course } from './model/course';
import { CoursesService } from './courses.service';
import { Lesson } from './model/lesson';

export function urlLessonResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<Lesson> {
  const service: CoursesService = inject(CoursesService);

  return service.findLessonById(route.params['id']).pipe(
    catchError((err) => {
      console.error('In Lesson resolver - catchError, err = ');
      console.error({ err });
      return observableOf(null);
    })
  );
}
