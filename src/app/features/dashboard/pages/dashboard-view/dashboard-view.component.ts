import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseComponent, BaseTableComponent } from '@shared/components';
import * as _ from 'lodash';
import { DashboardModel, newModel } from '../../models/dashboard.model';

@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent extends BaseComponent implements OnInit {
  constructor(inject: Injector, private service: CommonCategoryService) {
    super(inject);
  }
  news?: newModel[];
  getNewRecord() {
    this.service.getNewRecord(`/new-list`).subscribe({
      next: (value) => {
        this.news = _.take(value, 3);
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
