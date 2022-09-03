import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { ScreenType } from '@cores/utils/enums';
import { BaseTableComponent } from '@shared/components';
import { MenuItem } from 'primeng/api';

import { TeacherModel } from '../../models/teacher.model';
@Component({
  selector: 'app-teacher-description',
  templateUrl: './teacher-description.component.html',
  styleUrls: ['./teacher-description.component.scss'],
})
export class TeacherDescriptionComponent extends BaseTableComponent<TeacherModel> implements OnInit {
  id?: string | null;

  constructor(inject: Injector, service: CommonCategoryService) {
    super(inject, service);
  }

  model: TeacherModel = {};
  ngOnInit(): void {
    this.loadingService.start();
    this.id = this.route?.snapshot.paramMap.get('teacherId');
    this.viewDetail(this.id!);
  }
  override viewDetail(id: string) {
    this.loadingService.start();
    this.serviceBase.findById(`finbyTeacher/` + id).subscribe({
      next: (data: any) => {
        this.model = data;
        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }
}
