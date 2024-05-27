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

const headers = new HttpHeaders()
  .set('Accept', '*/*')
  .set('content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private httpBackend: HttpBackend, private http: HttpClient) {}

  findAll(): Observable<any> {
    return new HttpClient(this.httpBackend).get('/api/courses.json');
  }

  findCourseById(id: number): Observable<Course> {
    return new HttpClient(this.httpBackend).get<Course>(
      `/api/courses/${id}.json`
    );
  }

  findCourseByUrl(url: string): Observable<Course> {
    return new HttpClient(this.httpBackend).get<Course>(
      `/api/courses/${url}.json`
    );
  }

  findlessons(courseId: number): Observable<any> {
    return new HttpClient(this.httpBackend).get(
      `/api/courses/${courseId}/lessons.json`
    );
  }

  findlessonsByUrl(courseUrl: string): Observable<any> {
    return new HttpClient(this.httpBackend).get(
      `/api/courses/${courseUrl}/lessons.json`
    );
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
