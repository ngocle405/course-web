import { Component, Injector, OnInit } from '@angular/core';
import { ProcessService } from 'src/app/features/administration/config-process/services/process.service';
import { ScreenType } from '@cores/utils/enums';
import { BaseTableComponent } from '@shared/components';
import { find, forEach, get } from 'lodash';
import { MenuItem } from 'primeng/api';
import { LeaveApplicationActionComponent } from '../../components';
import { TaskModel } from '../../models/task-model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent extends BaseTableComponent<TaskModel> implements OnInit {
  constructor(injector: Injector, private service: TaskService, private processService: ProcessService) {
    super(injector, service);
  }
  override params: TaskModel = {
    startDate: null,
    endDate: null,
    approverFinal: '',
    startApprovedDateFinal: null,
    endApprovedDateFinal: null,
    status: '',
    employeeCode: '',
    processId: '',
  };
  listProcess: MenuItem[] = [];

  ngOnInit(): void {
    this.processService.getListProcess().subscribe({
      next: (listProcess) => {
        forEach(listProcess, (process) => {
          this.listProcess.push({
            label: process.name,
            id: process.id,
            command: () => {
              this.instanceProcess(process.id);
            },
          });
        });
        this.search();
        this.loadingService.complete();
      },
      error: () => {
        this.loadingService.complete();
      },
    });
  }

  override initConfigAction() {
    this.configAction = {
      component: LeaveApplicationActionComponent,
      title: 'đơn nghỉ phép',
      dialog: {
        width: '85%',
      },
    };
  }

  override mapDataSearch(): TaskModel {
    return { page: this.dataTable.currentPage, size: this.dataTable.size, ...this.params };
  }

  override search(firstPage?: boolean) {
    if (firstPage) {
      this.dataTable.currentPage = 0;
    }
    this.loadingService.start();
    const params = this.mapDataSearch();
    this.service?.getTaskByUser().subscribe({
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

  override viewEdit(id: string) {
    if (this.loadingService || !this.configAction?.component) {
      return;
    }
    this.loadingService.start();
    this.service.getTaskById(id).subscribe({
      next: (data) => {
        const formConfig = find(get(data, 'processVariables.FORM_CONFIG', []), (item) => item.formKey === data.formKey);
        const dialog = this.dialogService?.open(this.configAction!.component, {
          header: formConfig?.name,
          showHeader: false,
          width: this.configAction!.dialog?.width || '85%',
          height: '90%',
          data: {
            model: data.processVariables,
            state: this.propData,
            screenType: ScreenType.Update,
            taskId: data.taskId,
            formConfig,
            id,
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
    });
  }

  instanceProcess(id: string) {
    this.messageService?.confirm().subscribe((isConfirm) => {
      if (isConfirm) {
        this.loadingService.start();
        this.processService.instanceProcess(id).subscribe({
          next: () => {
            this.search();
            this.loadingService.complete();
          },
          error: () => {
            this.loadingService.complete();
          },
        });
      }
    });
  }
}
