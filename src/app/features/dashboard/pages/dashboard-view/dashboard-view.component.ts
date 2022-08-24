import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseTableComponent } from '@shared/components';
import { DashboardModel } from '../../models/dashboard.model';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent extends BaseTableComponent<DashboardModel> implements OnInit {
  constructor(inject: Injector, private service: CommonCategoryService) {
    super(inject, service);
  }
  news: any;
  getNewRecord() {
    this.service.getNewRecord(`/new-list`).subscribe((data) => {
      this.news = data;
      console.log(data);
    });
  }
  ngOnInit(): void {
    this. getNewRecord();
  }
}
