import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseService } from 'src/app/core/services/base.service';
import { environment } from 'src/environments/environment';
import { CommonCategoryModel, CommonModel, WardModel } from '../models/common-category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService<CommonCategoryModel> {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/common-category`);
  }

  override findByCode(code: string) {
    return this.http.get<CommonCategoryModel>(`${this.baseUrl}/get-children/${code}`);
  }

  override update(data: CommonCategoryModel) {
    return this.http.put<string>(`${this.baseUrl}/${data.code}`, data);
  }

  getListChildrenCategory(codeCategory: string) {
    return this.http
      .get<CommonCategoryModel>(`${this.baseUrl}/get-children/${codeCategory}`)
      .pipe(map((data) => data.commons!));
  }

  getCountries() {
    return this.http.get<CommonModel[]>(`${this.baseUrl}/countries`);
  }

  getProvinces(countryCode: string) {
    return this.http.get<CommonModel[]>(`${this.baseUrl}/provinces/${countryCode}`);
  }

  getDistricts(provinceCode: string) {
    return this.http.get<CommonModel[]>(`${this.baseUrl}/districts/${provinceCode}`);
  }

  getWards(districtCode: string) {
    return this.http.get<CommonModel[]>(`${this.baseUrl}/wards/${districtCode}`);
  }

  getWarCode(wardCode: string) {
    return this.http
      .post<WardModel[]>(`${environment.endpoint_url}/wards`, { wardsCode: [wardCode] })
      .pipe(map((val) => val[0]));
  }
}
