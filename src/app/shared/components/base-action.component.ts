import { Subscription } from 'rxjs';
import { Injector, OnDestroy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileModel } from 'src/app/core/models/user-profile.model';
import { CommonCategoryService } from 'src/app/core/services/common-category.service';
import { SessionService } from 'src/app/core/services/session.service';
import { StreamDataService } from 'src/app/core/services/stream-data.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationMessageService } from 'src/app/core/services/message.service';
import { ScreenType, SessionKey } from 'src/app/core/utils/enums';
import { FunctionModel } from 'src/app/core/models/function.model';
import { cleanDataForm, validateAllFormFields } from 'src/app/core/utils/common-functions';
import { BaseService } from 'src/app/core/services/base.service';
import { LoadingService } from '@cores/services/loading.service';

@Component({
  template: `<ng-content></ng-content>`,
})
export class BaseActionComponent implements OnDestroy {
  public objFunction: FunctionModel | undefined;
  public currUser: UserProfileModel;

  protected messageService!: NotificationMessageService;
  protected router!: Router;
  protected route!: ActivatedRoute;
  protected location!: Location;
  protected streamDataService!: StreamDataService;
  protected sessionService!: SessionService;
  protected ref!: ChangeDetectorRef;
  protected commonService!: CommonCategoryService;
  protected fb: FormBuilder | undefined;
  protected refDialog!: DynamicDialogRef;
  protected configDialog!: DynamicDialogConfig;
  public loadingService!: LoadingService;

  subscription: Subscription | undefined;
  subscriptions: Subscription[] = [];
  form = new FormGroup({});
  title: string | undefined;
  message = {
    create: {
      success: 'Thêm mới thành công',
      error: 'Thêm mới không thành công',
    },
    update: {
      success: 'Cập nhật thành công',
      error: 'Cập nhật không thành công',
    },
  };
  data: any;
  state: any;
  screenType: ScreenType | undefined;

  constructor(private injector: Injector, public service: BaseService) {
    this.init();
    this.currUser = this.sessionService?.getSessionData(SessionKey.UserProfile);
    if (this.configDialog) {
      this.title = this.configDialog.header;
      this.data = this.configDialog.data?.model;
      this.screenType = this.configDialog?.data?.screenType;
      this.state = this.configDialog?.data?.state;
    }
  }

  init() {
    this.messageService = this.injector.get(NotificationMessageService);
    this.fb = this.injector.get(FormBuilder);
    this.router = this.injector.get(Router);
    this.route = this.injector.get(ActivatedRoute);
    this.location = this.injector.get(Location);
    this.streamDataService = this.injector.get(StreamDataService);
    this.sessionService = this.injector.get(SessionService);
    this.ref = this.injector.get(ChangeDetectorRef);
    this.commonService = this.injector.get(CommonCategoryService);
    this.refDialog = this.injector.get(DynamicDialogRef);
    this.configDialog = this.injector.get(DynamicDialogConfig);
    this.loadingService = this.injector.get(LoadingService);
  }

  save() {
    if (this.loadingService.loading) {
      return;
    }
    const data = this.getDataForm();
    if (this.form?.status === 'VALID') {
      this.messageService?.confirm().subscribe((isConfirm) => {
        if (isConfirm) {
          if (this.screenType == ScreenType.Create) {
            this.create(data);
          } else {
            this.update(data);
          }
        }
      });
    } else {
      validateAllFormFields(this.form);
    }
  }

  getDataForm() {
    return cleanDataForm(this.form);
  }

  create(data: any) {
    this.loadingService.start();
    this.service.create(data).subscribe({
      next: () => {
        this.messageService.success(this.message.create.success);
        this.refDialog.close(true);
        this.loadingService.complete();
      },
      error: (err) => {
        this.messageService.error(err.error.message);
        this.loadingService.complete();
      },
    });
  }

  update(data: any) {
    this.loadingService.start();
    this.service.update(data).subscribe({
      next: () => {
        this.messageService.success(this.message.update.success);
        this.refDialog.close(true);
        this.loadingService.complete();
      },
      error: (err) => {
        this.messageService.error(err.error.message);
        this.loadingService.complete();
      },
    });
  }

  cancel() {
    if (this.configDialog) {
      this.refDialog.close();
    } else {
      this.location!.back();
    }
  }

  onDestroy() {}

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscriptions?.forEach((sub) => {
      sub.unsubscribe();
    });
    this.onDestroy();
  }
}
