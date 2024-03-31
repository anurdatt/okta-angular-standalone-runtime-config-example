import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from './model/course';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private httpBackend: HttpBackend) {}

  findAll(): Observable<any> {
    return new HttpClient(this.httpBackend).get('/api/courses.json');
  }

  findCourseById(id: number): Observable<Course> {
    return new HttpClient(this.httpBackend).get<Course>(
      `/api/courses/${id}.json`
    );
  }

  findlessons(courseId: number): Observable<any> {
    return new HttpClient(this.httpBackend).get(
      `/api/courses/${courseId}/lessons.json`
    );
  }
}
