import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseComponent, BaseTableComponent } from '@shared/components';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent extends BaseComponent implements OnInit {
  totalLength: any;
  searchText: any;
  constructor(inject: Injector, private service: CommonCategoryService) {
    super(inject);
  }
  stateData: any;
  getAll() {
    this.service.get('/listCourse').subscribe({
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
  ngOnInit(): void {
    this.loadingService.start();
    this.getAll();
  }
}
