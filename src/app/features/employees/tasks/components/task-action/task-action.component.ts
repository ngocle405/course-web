import { Component, Injector, OnInit } from '@angular/core';
import { FieldConfigModel } from 'src/app/features/administration/config-process/models/field.model';
import { StageProcess } from 'src/app/features/administration/config-process/models/stage-process.model';
import { ProcessService } from 'src/app/features/administration/config-process/services/process.service';
import { convertDataField, validateAllFormFields } from '@cores/utils/common-functions';
import { BaseActionComponent } from '@shared/components';
import { findIndex, forEach, get, has, isUndefined, orderBy, set } from 'lodash';
import { PrimeIcons } from 'primeng/api';
import { FieldType, ScreenType } from 'src/app/core/utils/enums';
import { TaskService } from '../../services/task.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'task-action',
  templateUrl: './task-action.component.html',
  styleUrls: ['./task-action.component.scss'],
})
export class LeaveApplicationActionComponent extends BaseActionComponent implements OnInit {
  constructor(injector: Injector, service: TaskService, private processService: ProcessService) {
    super(injector, service);
  }

  listField: FieldConfigModel[] = [];
  fieldType = FieldType;
  stage?: StageProcess;
  listApprover: any[] = [];
  formKey?: string;

  ngOnInit(): void {
    if (this.screenType !== ScreenType.Create) {
      this.listApprover = get(this.data, 'APPROVER', []).map((item: any) => {
        return {
          ...item,
          color: '#607D8B',
        };
      });
      if (has(this.data, 'LEAVE_OF_ABSENCE.approverDTOS')) {
        forEach(get(this.data, 'LEAVE_OF_ABSENCE.approverDTOS'), (item) => {
          const index = findIndex(this.listApprover, (i) => i.employeeCode === item.employeeCode);
          if (index !== -1) {
            this.listApprover[index].decision = item.decision === 'APPROVED' ? 'Đã duyệt' : 'Từ chối';
            this.listApprover[index].note = item.note;
            this.listApprover[index].approvedDate = item.approvedDate;
            this.listApprover[index].color = '#22C55E';
            this.listApprover[index].icon = PrimeIcons.CHECK;
          }
        });
      }
      this.listField = orderBy(get(this.configDialog, 'data.formConfig.properties', []), 'format.order');
      this.stage = {
        id: this.configDialog?.data?.id,
        variables: {},
      };
      this.formKey = this.configDialog?.data?.formConfig?.formKey;
    }
    this.initForm();
  }

  initForm() {
    this.form = this.fb!.group({});
    this.listField.forEach((item) => {
      this.form.addControl(
        item.name,
        this.fb!.control(
          {
            value: convertDataField(get(this.data, item.objectMappingIn!), item.format.type),
            disabled: item.format.isDisabled,
          },
          item.format.mandatory ? Validators.required : null
        )
      );
    });
    if (this.screenType === ScreenType.Detail) {
      this.form.disable();
    }
  }

  override save(isApproved?: boolean) {
    if (this.form.status === 'VALID') {
      const data = this.getDataForm();
      this.messageService?.confirm().subscribe((isConfirm) => {
        if (isConfirm) {
          this.loadingService.start();
          forEach(this.listField, (item) => {
            if (item.objectMappingOut) {
              set(this.stage?.variables, item.objectMappingOut, data[item.name]);
            }
          });
          if (!isUndefined(isApproved)) {
            set(this.stage?.variables, 'PAYLOAD.decision', isApproved ? 'APPROVED' : 'REJECTED');
          }
          this.processService.nextStep(this.stage!).subscribe({
            next: () => {
              this.messageService?.success('Thực hiện thành công');
              this.loadingService.complete();
              this.refDialog.close(true);
            },
            error: () => {
              this.messageService?.error('Thực hiện không thành công');
              this.loadingService.complete();
            },
          });
        }
      });
    } else {
      validateAllFormFields(this.form);
    }
  }
}
