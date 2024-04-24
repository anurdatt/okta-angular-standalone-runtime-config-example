import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from './model/course';
import { CoursesService } from './courses.service';

export function courseResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<Course> {
  const service: CoursesService = inject(CoursesService);
  let course: Observable<Course> = of(null);
  try {
    service.findCourseById(route.params['id']); 
  } catch(e) {
    console.error({e});
  }
  return course;
}
