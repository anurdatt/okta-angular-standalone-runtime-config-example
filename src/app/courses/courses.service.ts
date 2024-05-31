import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from './model/course';
import { environment } from '../../environments/environment';
import { Lesson } from './model/lesson';

const headers = new HttpHeaders()
  .set('Accept', '*/*')
  .set('content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private httpBackend: HttpBackend, private http: HttpClient) {}

  findAll(): Observable<Course[]> {
    const url = `${environment.coursesApiUrl}/api/courses`;
    const params = new HttpParams();
    return this.http.get<Course[]>(url, { headers, params });
  }

  findCourseById(id: number): Observable<Course> {
    // return new HttpClient(this.httpBackend).get<Course>(
    //   `/api/courses/${id}.json`
    // );

    const url = `${environment.coursesApiUrl}/api/courses/${id}`;
    const params = new HttpParams();
    return this.http.get<Course>(url, { headers, params });
  }

  findCoursesByUrl(url: string): Observable<Course[]> {
    // return new HttpClient(this.httpBackend).get<Course>(
    //   `/api/courses/${url}.json`
    // );

    const apiUrl = `${environment.coursesApiUrl}/api/courses`;
    const params = new HttpParams().set('courseUrl', url);
    return this.http.get<Course[]>(apiUrl, { headers, params });
  }

  findlessons(courseId: number): Observable<Lesson[]> {
    // return new HttpClient(this.httpBackend).get(
    //   `/api/courses/${courseId}/lessons.json`
    // );
    const url = `${environment.coursesApiUrl}/api/lessons`;
    const params = new HttpParams().set('courseId', courseId);
    return this.http.get<Lesson[]>(url, { headers, params });
  }

  findlessonsByUrl(courseUrl: string): Observable<Lesson[]> {
    // return new HttpClient(this.httpBackend).get(
    //   `/api/courses/${courseUrl}/lessons.json`
    // );

    const url = `${environment.coursesApiUrl}/api/lessons`;
    const params = new HttpParams().set('courseUrl', courseUrl);
    return this.http.get<Lesson[]>(url, { headers, params });
  }

  findLessonById(id: number): Observable<Lesson> {
    // return new HttpClient(this.httpBackend).get<Lesson>(
    //   `/api/lessons/${id}.json`
    // );
    const url = `${environment.coursesApiUrl}/api/lessons/${id}`;
    const params = new HttpParams();
    return this.http.get<Lesson>(url, { headers, params });
  }

  getSignedUrl(fileName: string, bucketName: string) {
    const params = new HttpParams()
      .set('bucketName', bucketName)
      .set('fileName', fileName);

    const url = `${environment.coursesApiUrl}/api/media/signed-url`;
    return this.http.get(url, {
      headers: headers,
      params: params,
      responseType: 'text',
    });
  }
}
