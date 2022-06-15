import { Component, Injector, OnInit } from '@angular/core';
import { ScreenType } from '@cores/utils/enums';
import { BaseTableComponent } from '@shared/components';
import { OnLeaveActionComponent } from '../../components';
import { OnLeaveModel } from '../../models/on-leave.model';
import { OnLeaveService } from '../../services/on-leave.service';
import { find, forEach } from 'lodash';

@Component({
  selector: 'on-leave-list',
  templateUrl: './on-leave-list.component.html',
  styleUrls: ['./on-leave-list.component.scss'],
})
export class OnLeaveListComponent extends BaseTableComponent<OnLeaveModel> implements OnInit {
  constructor(injector: Injector, private service: OnLeaveService) {
    super(injector, service);
  }
  override params: OnLeaveModel = {
    startDate: null,
    endDate: null,
    approverFinal: '',
    startApprovedDateFinal: null,
    endApprovedDateFinal: null,
    status: '',
    employeeCode: '',
  };
  listStatus = [
    { code: '', name: 'Tất cả' },
    { code: 'WAITING_APPROVAL', name: 'Đợi phê duyệt' },
    { code: 'MAKE_DECISION', name: 'Đã duyệt' },
  ];

  ngOnInit() {
    this.getState();
  }

  override search(firstPage?: boolean) {
    if (firstPage) {
      this.dataTable.currentPage = 0;
    }
    this.loadingService.start();
    const params = this.mapDataSearch();
    this.service?.search(params).subscribe({
      next: (data) => {
        this.dataTable = data;
        forEach(this.dataTable.content, (item) => {
          item.status = find(this.listStatus, (i) => i.code === item.status)?.name;
        });
        this.loadingService.complete();
        this.prevParams = params;
      },
      error: () => {
        this.loadingService.complete();
      },
    });
  }

  override initConfigAction() {
    this.configAction = {
      component: OnLeaveActionComponent,
      title: 'đơn nghỉ phép',
      dialog: {
        width: '85%',
      },
    };
  }

  override mapDataSearch(): OnLeaveModel {
    return { page: this.dataTable.currentPage, size: this.dataTable.size, ...this.params };
  }

  override viewDetail(id: string) {
    if (this.loadingService.loading || !this.configAction?.component) {
      return;
    }
    this.loadingService.start();
    this.service.findByCode(id).subscribe({
      next: (data: any) => {
        this.dialogService?.open(this.configAction!.component, {
          header: `Chi tiết ${this.configAction!.title.toLowerCase()}`,
          showHeader: false,
          width: this.configAction!.dialog?.width || '85%',
          data: {
            screenType: ScreenType.Detail,
            model: data,
            state: this.propData,
          },
        });
        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService?.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }
}
