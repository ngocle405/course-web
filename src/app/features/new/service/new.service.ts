import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@cores/services/base.service';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class NewService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/homes`);
  }
}
