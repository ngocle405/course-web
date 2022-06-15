import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonModel } from '@common-category/models/common-category.model';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { SessionService } from './session.service';
@Injectable({
  providedIn: 'root',
})
export class CommonCategoryService extends BaseService {
  constructor(http: HttpClient, private session: SessionService) {
    super(http, `${environment.endpoint_url}/homes`);
  }
  getCourseList() {
    return this.http.get<CommonModel[]>(`${environment.endpoint_url}/Courses`);
  }
}
