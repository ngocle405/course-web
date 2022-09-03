import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseTableComponent } from '@shared/components';
import * as _ from 'lodash';
import { DashboardModel, newModel } from '../../models/dashboard.model';

@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent extends BaseTableComponent<DashboardModel> implements OnInit {
  constructor(inject: Injector, private service: CommonCategoryService) {
    super(inject, service);
  }
  news?: newModel[];
  getNewRecord() {
    this.service.getNewRecord(`/new-list`).subscribe({
      next: (value) => {
        this.news = _.take(value, 3);
        console.log(this.news);

        this.loadingService.complete();
      },
      error: (err) => {
        console.log(err);
        this.loadingService.complete();
      },
    });
  }
  ngOnInit(): void {
    this.loadingService.start();
    this.getNewRecord();
  }
  viewcourse() {
    this.router.navigateByUrl('/mb-ageas/course');
  }
}
