import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@cores/services/base.service';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { environment } from '@env';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { CommonModel } from '../models/register.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService extends BaseService {
  constructor(http: HttpClient, private commonService: CommonCategoryService) {
    super(http, `${environment.endpoint_url}`);
  }

  override getState(): Observable<any> {
    this.state = {
      listAddressCompany: [
        {
          value: 'Tòa nhà 21 Cát Linh, phường Cát Linh, quận Đống Đa, Hà Nội',
          name: 'Tòa nhà 21 Cát Linh, phường Cát Linh, quận Đống Đa, Hà Nội',
        },
        {
          value: 'Tòa nhà 1 Ngọc Khánh Plaza, Phường Ngọc Khánh, Quận Ba Đình, Hà Nội',
          name: 'Tòa nhà 1 Ngọc Khánh Plaza, Phường Ngọc Khánh, Quận Ba Đình, Hà Nội',
        },
        {
          value: ' Tòa nhà Golden Palm, 21 Lê Văn Lương, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội',
          name: ' Tòa nhà Golden Palm, 21 Lê Văn Lương, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội',
        },
      ],
      listLevel: [
        { value: 'Học sinh', name: 'Học sinh' },
        { value: 'Cao đẳng,ĐH', name: 'Cao đẳng,ĐH' },
        { value: 'Đã đi làm', name: 'Đã đi làm' },
        { value: 'Khác', name: 'Khác' },
      ],
      listKnow: [
        { value: 'facebook', name: 'Facebook' },
        { value: 'Báo chí', name: 'Báo chí' },
        { value: 'Diễn đàn', name: 'Diễn đàn' },
        { value: 'Thư NgocLe Tech', name: 'Thư NgocLe Tech' },
        { value: 'Khác', name: 'Khác' },
      ],
    };

    return forkJoin({
      getCourseList: this.getCourseList().pipe(catchError(() => of([]))),
    }).pipe(
      map((data: any) => {
        this.state = {
          ...this.state,
          ...data,
        };
        return this.state;
      })
    );
  }
  override create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Homes/Register`, data);
  }
  override findAll() {
    return this.http.get(`${this.baseUrl}/Homes/new-list`);
  }
  getCourseList() {
    return this.http.get<CommonModel[]>(`${environment.endpoint_url}/Courses`);
  }
}
