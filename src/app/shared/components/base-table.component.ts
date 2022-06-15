import { Subscription } from 'rxjs';
import { Injector, OnDestroy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileModel } from 'src/app/core/models/user-profile.model';
import { CommonCategoryService } from 'src/app/core/services/common-category.service';
import { SessionService } from 'src/app/core/services/session.service';
import { StreamDataService } from 'src/app/core/services/stream-data.service';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationMessageService } from 'src/app/core/services/message.service';
import { ScreenType, SessionKey } from 'src/app/core/utils/enums';
import { FunctionModel } from 'src/app/core/models/function.model';
import { DataTable } from 'src/app/core/models/data-table.model';
import { BaseService } from 'src/app/core/services/base.service';
import { PaginatorModel } from 'src/app/core/models/paginator.model';
import { ActionConfig } from 'src/app/core/models/action-config.model';
import { cloneDeep } from 'lodash';
import { LoadingService } from '@cores/services/loading.service';

@Component({
  template: `<ng-content></ng-content>`,
  providers: [DialogService],
})
export class BaseTableComponent<M> implements OnDestroy {
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
  protected fb: FormBuilder | undefined;
  public loadingService!: LoadingService;

  stateData: any;
  propData: any;
  dataTable: DataTable<M> = {
    content: [],
    currentPage: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: 0,
  };
  configAction: ActionConfig | undefined;
  prevParams: any;
  params: M | FormGroup | undefined;
  fileNameExcel = 'list-data.xlsx';
  subscription: Subscription | undefined;
  subscriptions: Subscription[] = [];

  constructor(private injector: Injector, protected serviceBase: BaseService) {
    this.init();
    this.initConfigAction();
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
  }

  initConfigAction() {}
  getAll() {
    this.loadingService.start();
    this.serviceBase.get().subscribe({
      next: (data) => {
        this.stateData = cloneDeep(data);
        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService?.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }

  getState() {
    this.serviceBase.getState().subscribe({
      next: (state) => {
        this.propData = cloneDeep(state);
        this.stateData = cloneDeep(state);
        this.mapState();
        this.search();
        this.getAll();
      },
    });
  }

  mapState() {}

  search(firstPage?: boolean) {
    if (firstPage) {
      this.dataTable.currentPage = 0;
    }
    this.loadingService.start();
    const params = this.mapDataSearch();

    this.serviceBase.search(<M>(<unknown>params)).subscribe({
      next: (data) => {
        this.dataTable = data;
        this.loadingService.complete();
        this.prevParams = params;
      },
      error: () => {
        this.loadingService.complete();
      },
    });
  }

  pageChange(paginator: PaginatorModel) {
    this.dataTable.currentPage = paginator.page;
    this.dataTable.size = paginator.rows;
    this.dataTable.first = paginator.first;
    this.search();
  }

  mapDataSearch(): M {
    const params = {
      page: this.dataTable.currentPage,
      size: this.dataTable.size,
      ...this.params,
    };
    return <M>(<unknown>params);
  }

  viewCreate() {
    if (!this.configAction?.component) {
      return;
    }
    const dialog = this.dialogService?.open(this.configAction.component, {
      header: `Thêm mới ${this.configAction.title.toLowerCase()}`,
      showHeader: false,
      width: this.configAction.dialog?.width || '85%',
      data: {
        screenType: ScreenType.Create,
        state: this.propData,
      },
    });
    dialog?.onClose.subscribe({
      next: (isSuccess) => {
        if (isSuccess) {
          this.search();
        }
      },
    });
  }

  viewEdit(code: string) {
    if (this.loadingService.loading || !this.configAction?.component) {
      return;
    }
    this.loadingService.start();
    this.serviceBase.findByCode(code).subscribe({
      next: (data: M) => {
        const dialog = this.dialogService?.open(this.configAction!.component, {
          header: `Cập nhật ${this.configAction!.title.toLowerCase()}`,
          showHeader: false,
          width: this.configAction!.dialog?.width || '85%',
          data: {
            model: data,
            state: this.propData,
            screenType: ScreenType.Update,
          },
        });
        dialog?.onClose.subscribe({
          next: (isSuccess) => {
            if (isSuccess) {
              this.search();
            }
          },
        });
        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }

  viewDetail(code: string) {
    if (this.loadingService.loading || !this.configAction?.component) {
      return;
    }
    this.loadingService.start();
    this.serviceBase.findByCode(code).subscribe({
      next: (data: any) => {
        this.dialogService?.open(this.configAction!.component, {
          header: `Chi tiết ${this.configAction!.title.toLowerCase()}`,
          showHeader: false,
          width: this.configAction!.dialog?.width || '85%',
          data: {
            model: data,
            state: this.stateData,
            screenType: ScreenType.Detail,
          },
        });
        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }

  deleteItem(id: string | number) {
    if (this.loadingService.loading) {
      return;
    }
    this.messageService.confirm().subscribe((isConfirm) => {
      if (isConfirm) {
        this.loadingService.start();
        this.serviceBase.delete(id).subscribe({
          next: () => {
            this.messageService.success('Thực hiện xoá bản ghi thành công');
            this.search();
          },
          error: (e) => {
            this.loadingService.complete();
            this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
          },
        });
      }
    });
  }

  exportExcel() {
    if (this.loadingService.loading) {
      return;
    }
    this.loadingService.start();
    this.serviceBase.exportExcel(this.fileNameExcel, this.prevParams).subscribe({
      next: () => {
        this.loadingService.complete();
      },
      error: () => {
        this.loadingService.complete();
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
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
