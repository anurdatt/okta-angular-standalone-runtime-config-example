import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../blogs/model/tag';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


const headers = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('content-Type', 'application/json');


@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient) {}

  findAll(): Observable<Tag[]> {
    const url = `${environment.blogsApiUrl}/api/tags`;
    const params = new HttpParams();
    return this.http.get<Tag[]>(url, { headers, params });
  }
}
