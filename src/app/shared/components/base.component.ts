import { Subscription } from 'rxjs';
import { Injector, OnDestroy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileModel } from 'src/app/core/models/user-profile.model';
import { CommonCategoryService } from 'src/app/core/services/common-category.service';
import { SessionService } from 'src/app/core/services/session.service';
import { StreamDataService } from 'src/app/core/services/stream-data.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationMessageService } from 'src/app/core/services/message.service';
import { SessionKey } from 'src/app/core/utils/enums';
import { FunctionModel } from 'src/app/core/models/function.model';
import { LoadingService } from '@cores/services/loading.service';

@Component({
  template: `<ng-content></ng-content>`,
  providers: [DialogService],
})
export class BaseComponent implements OnDestroy {
  public objFunction: FunctionModel | undefined;
  public currUser: UserProfileModel;

  protected messageService!: NotificationMessageService;
  protected dialogService!: DialogService;
  protected router!: Router;
  protected route!: ActivatedRoute;
  protected location!: Location;
  protected streamDataService!: StreamDataService;
  protected sessionService!: SessionService;
  protected ref!: ChangeDetectorRef;
  protected commonService!: CommonCategoryService;
  protected fb!: FormBuilder;
  protected loadingService!: LoadingService;
  protected refDialog!: DynamicDialogRef;
  protected configDialog!: DynamicDialogConfig;

  subscription: Subscription | undefined;
  subscriptions: Subscription[] = [];

  constructor(private injector: Injector) {
    this.init();
    this.currUser = this.sessionService?.getSessionData(SessionKey.UserProfile);
  }

  init() {
    this.messageService = this.injector.get(NotificationMessageService);
    this.dialogService = this.injector.get(DialogService);
    this.fb = this.injector.get(FormBuilder);
    this.router = this.injector.get(Router);
    this.route = this.injector.get(ActivatedRoute);
    this.location = this.injector.get(Location);
    this.streamDataService = this.injector.get(StreamDataService);
    this.sessionService = this.injector.get(SessionService);
    this.ref = this.injector.get(ChangeDetectorRef);
    this.commonService = this.injector.get(CommonCategoryService);
    this.loadingService = this.injector.get(LoadingService);
    this.refDialog = this.injector.get(DynamicDialogRef);
    this.configDialog = this.injector.get(DynamicDialogConfig);
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
