import { Component, Injector, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonCategoryService } from '@cores/services/common-category.service';
import { BaseComponent, BaseTableComponent } from '@shared/components';
import { MenuItem } from 'primeng/api';
import { CourseModel } from '../../models/course.model';
import { RegisterService } from 'src/app/features/register-course/service/register.service';
import { NgForm } from '@angular/forms';
import { StateCourse } from 'src/app/features/register-course/models/register.model';
//declare var $: any;
@Component({
  selector: 'app-course-description',
  templateUrl: './course-description.component.html',
  styleUrls: ['./course-description.component.scss'],
})
export class CourseDescriptionComponent extends BaseComponent implements OnInit {
  constructor(inject: Injector, private service: CommonCategoryService,private serviceRegister: RegisterService) {
    super(inject);
  }
  @ViewChild('form', { static: false }) form!: NgForm;
  @ViewChild('modal', { static: false }) modal!: ElementRef;
  items: MenuItem[] = [];
  stateData: StateCourse = {
    getCourseList: [],
    listAddressCompany: [],
    listLevel: [],
    listKnow: [],
  };
  home!: MenuItem;
  model: CourseModel = {};
  modelRegister = { studentName: null, phone: null, level: null, courseId: '', email: null }
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
    const id = this.route?.snapshot.paramMap.get('courseId')!;
    this.viewCourse(id);
    this.serviceRegister.getState().subscribe((data) => {
      this.stateData = data;
    });
  }
  save() {
    this.loadingService.start();
    this.modelRegister.courseId = this.model.courseId!;
    this.serviceRegister.create(this.modelRegister).subscribe({
      next: () => {
        this.modal.nativeElement.querySelector('button.close').click();
        this.messageService.success('Đăng ký thành công');
        this.form.resetForm();
        this.loadingService.complete();
      },
      error: (err) => {
        this.messageService.error('Đăng ký không thành công');
        this.loadingService.complete();
      },
    })
    
   }
}
