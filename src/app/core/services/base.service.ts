import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { BaseData } from '../abstract/base-data';
import { DataTable } from '../models/data-table.model';
import { mapDataTable, removeParamNullOrUndefined } from '../utils/common-functions';

@Injectable()
export class BaseService implements BaseData {
  constructor(public http: HttpClient, @Inject(String) public baseURL: string) {
    this.baseUrl = baseURL;
  }

  baseUrl!: string;
  state: any;
  get(href: string = '', params: any = {}) {
    return this.http.get<any>(this.baseURL + `${href}`, {
      params: params,
    });
  }
  getState(): Observable<any> {
    return of(this.state);
  }

  search(params?: any, isPost?: boolean): Observable<DataTable<any>> {
    const newParam: any = removeParamNullOrUndefined(params);
    if (isPost) {
      return this.http
        .post<DataTable<any>>(`${this.baseUrl}`, { params: newParam })
        .pipe(map((data) => mapDataTable(data, params)));
    }
    return this.http
      .get<DataTable<any>>(`${this.baseUrl}`, {
        params: { ...newParam },
      })
      .pipe(map((data) => mapDataTable(data, params)));
  }
  findById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  findAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  findByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${code}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data, { responseType: 'text' });
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, data, { responseType: 'text' });
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  exportExcel(fileName: string, params?: any): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/export`, { params: { ...params }, responseType: 'arraybuffer' }).pipe(
      map((res) => {
        saveAs(
          new Blob([res], {
            type: 'application/octet-stream',
          }),
          fileName
        );
        return true;
      })
    );
  }
}
