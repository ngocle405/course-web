import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {
    // super(http, `${environment.endpoint_url}/processes/resign-process`);
  }

  getInfoEmployee(code: string) {
    return this.http.get(`${environment.endpoint_url}/employees/general-information/${code}`);
  }
}
