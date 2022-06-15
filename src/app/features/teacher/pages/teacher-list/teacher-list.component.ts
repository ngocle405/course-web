import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseTableComponent } from '@shared/components';
import { cloneDeep } from 'lodash';
import { MenuItem } from 'primeng/api';
import { TeacherModel } from '../../models/teacher.model';
@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent extends BaseTableComponent<TeacherModel> implements OnInit {
  constructor(inject: Injector, service: CommonCategoryService) {
    super(inject, service);
  }

  ngOnInit(): void {
    this.getState();
  }
  override getAll() {
    this.loadingService.start();
    this.serviceBase.get('/teacher-list').subscribe({
      next: (data) => {
        this.stateData = cloneDeep(data);
        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService?.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }
}
