import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@cores/services/base.service';
import { environment } from '@env';
import { DashboardModel } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/`);
  }
}
