import { Component, Injector, OnInit } from '@angular/core';
import { cleanDataForm, validateAllFormFields } from '@cores/utils/common-functions';
import { BaseActionComponent } from '@shared/components';
import { StateCourse } from '../../models/register.model';
import { RegisterService } from '../../service/register.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends BaseActionComponent implements OnInit {
  stateData: StateCourse = {
    getCourseList: [],
    listAddressCompany: [],
    listLevel: [],
    listKnow: [],
  };

  constructor(inject: Injector, service: RegisterService) {
    super(inject, service);
  }
  newList: any;
   formRegister = this.fb!.group({
    studentName: ['', Validators.required],
    phone: ['', Validators.required],
    level: ['', Validators.required],
    workLocation: ['', Validators.required],
    know: ['', Validators.required],
    courseId: ['', Validators.required],
    description: [''],
    email: ['', [Validators.required, Validators.email]],
  });
  ngOnInit(): void {
    this.loadingService.start();
    this.service.getState().subscribe((data) => {
      this.stateData = data;
    });
    this.getNews();
    this.loadingService.complete();
  }
  override save() {
    const data = cleanDataForm(this.formRegister);
    if (this.formRegister?.status === 'VALID') {
      this.messageService?.confirm().subscribe((isConfirm) => {
        if (isConfirm) {
          this.create(data);
        }
      });
    } else {
      validateAllFormFields(this.formRegister!);
    }
  }
  getNews() {
    this.service.findAll().subscribe({
      next: (res) => {
        this.newList = res;
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService?.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }
  override create(data: any) {
    this.loadingService.start();
    this.service.create(data).subscribe({
      next: () => {
        this.formRegister.reset();
        this.messageService.success('Đăng ký thành công');
        this.refDialog.close(true);
        this.loadingService.complete();
      },
      error: (err) => {
        this.messageService.error('Đăng ký không thành công');
        this.loadingService.complete();
      },
    });
  }
}
