import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@cores/services/base.service';
import { environment } from '@env';
import { CourseModel } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService extends BaseService<CourseModel> {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/`);
  }
}
