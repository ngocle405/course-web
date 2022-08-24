import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
@Injectable({
  providedIn: 'root',
})
export class CommonCategoryService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/homes`);
  }
   getNewRecord(href: string = '') {
    return this.http.get(this.baseURL + `${href}`);
  }
  getTeacherRecord(href: string = '') {
    return this.http.get(this.baseURL + `${href}`);
  }

}
