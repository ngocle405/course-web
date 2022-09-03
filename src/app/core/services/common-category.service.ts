import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
@Injectable({
  providedIn: 'root',
})
export class CommonCategoryService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/homes`);
  }
  getNewRecord(href: string = ''): Observable<any> {
    return this.http.get<any>(this.baseURL + `${href}`);
  }
  getTeacherRecord(href: string = ''): Observable<any> {
    return this.http.get(this.baseURL + `${href}`);
  }
}
