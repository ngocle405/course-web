import { Component, Injector, OnInit } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseComponent } from '@shared/components';

@Component({
  selector: 'app-introduce-list',
  templateUrl: './introduce-list.component.html',
  styleUrls: ['./introduce-list.component.scss'],
})
export class IntroduceListComponent extends BaseComponent implements OnInit {
  constructor(inject:Injector,private service:CommonCategoryService) {
    super(inject);
  }
   
  news: any;
  teachers :any;
  getNewRecord() {
    this.service.getNewRecord(`/new-list`).subscribe((data) => {
      this.news = data;
    });
  }
  getTeacherRecord() {
    this.service.getNewRecord(`/teacher-list`).subscribe((data) => {
      this.teachers = data;
    });
  }
  ngOnInit(): void {
    this. getNewRecord();
    this.getTeacherRecord();
  }
}
