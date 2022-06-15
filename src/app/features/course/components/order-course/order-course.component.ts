import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseActionComponent } from '@shared/components';

@Component({
  selector: 'app-order-course',
  templateUrl: './order-course.component.html',
  styleUrls: ['./order-course.component.scss'],
})
export class OrderCourseComponent extends BaseActionComponent implements OnInit {
  constructor(inject: Injector, service: CommonCategoryService) {
    super(inject, service);
  }

  ngOnInit(): void {}
}
