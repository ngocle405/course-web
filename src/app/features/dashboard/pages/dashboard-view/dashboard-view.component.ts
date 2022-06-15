import { Component, Injector, OnInit } from '@angular/core';
import { BaseTableComponent } from '@shared/components';
import { DashboardModel } from '../../models/dashboard.model';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent extends BaseTableComponent<DashboardModel> implements OnInit {
  constructor(inject: Injector, private service: DashboardService) {
    super(inject, service);
  }
  teacher: any;
  GetTeacher() {
    this.service.get(`teachers`).subscribe((data) => {
      this.teacher = data;
      console.log(data);
    });
  }
  ngOnInit(): void {
    //this. GetTeacher();
  }
}
