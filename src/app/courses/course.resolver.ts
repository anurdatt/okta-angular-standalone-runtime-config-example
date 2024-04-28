import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, catchError, of as observableOf} from 'rxjs';
import { Course } from './model/course';
import { CoursesService } from './courses.service';

export function courseResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<Course> {
  const service: CoursesService = inject(CoursesService);

  return service.findCourseById(route.params['id']).pipe(
    catchError((err) => {
      console.error('In Course resolver - catchError, err = ')
      console.error({err});
      return observableOf(null);
    })
  );
}
