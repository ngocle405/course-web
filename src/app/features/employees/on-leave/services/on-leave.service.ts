import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/core/services/base.service';
import { environment } from 'src/environments/environment';
import { OnLeaveModel } from '../models/on-leave.model';
@Injectable({
  providedIn: 'root',
})
export class OnLeaveService extends BaseService<OnLeaveModel> {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/employees/leave-of-absence`);
  }
}
