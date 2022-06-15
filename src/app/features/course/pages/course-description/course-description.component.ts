import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseComponent, BaseTableComponent } from '@shared/components';
import { MenuItem } from 'primeng/api';
import { CourseModel } from '../../models/course.model';

@Component({
  selector: 'app-course-description',
  templateUrl: './course-description.component.html',
  styleUrls: ['./course-description.component.scss'],
})
export class CourseDescriptionComponent extends BaseComponent implements OnInit {
  constructor(inject: Injector, private service: CommonCategoryService) {
    super(inject);
  }
  items: MenuItem[] = [];

  home!: MenuItem;
  model: CourseModel = {};
  id?: any;
  viewCourse(id: string) {
    // if ( this.loadingService.loading) {
    //   return;
    // }
    this.loadingService.start();

    this.service.findById(`findByCourse/` + id).subscribe({
      next: (data: any) => {
        this.model = data;
        console.log(this.model);
        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService?.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }
  ngOnInit() {
    this.items = [{ label: 'Khóa học' }, { label: 'Chi tiết khóa học' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.id = this.route?.snapshot.paramMap.get('courseId');
    this.viewCourse(this.id);
  }
}
