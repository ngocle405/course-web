import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/core/services/base.service';
import { environment } from 'src/environments/environment';
import { RoleModel } from '../models/role.model';
@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService<RoleModel> {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/roles`);
  }
  override update(data: RoleModel): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${data.code}`, data);
  }
}
