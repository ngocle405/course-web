import { Component, Injector, OnInit } from '@angular/core';
import { FieldModel } from 'src/app/features/administration/config-process/models/field.model';
import { ProcessService } from 'src/app/features/administration/config-process/services/process.service';
import { convertDataField } from '@cores/utils/common-functions';
import { BaseActionComponent } from '@shared/components';
import { get } from 'lodash';
import { FieldType, ScreenType } from 'src/app/core/utils/enums';
import { OnLeaveService } from '../../services/on-leave.service';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'on-leave-action',
  templateUrl: './on-leave-action.component.html',
  styleUrls: ['./on-leave-action.component.scss'],
})
export class OnLeaveActionComponent extends BaseActionComponent implements OnInit {
  constructor(injector: Injector, service: OnLeaveService, private processService: ProcessService) {
    super(injector, service);
  }

  fieldType = FieldType;
  listField: FieldModel[] = [];
  listApprover: any[] = [];

  ngOnInit(): void {
    this.listApprover = get(this.data, 'approverDTOS', []).map((item: any) => {
      return {
        ...item,
        color: '#22C55E',
        icon: PrimeIcons.CHECK,
      };
    });
    this.listField = [
      {
        name: 'code',
        type: FieldType.Text,
        show: true,
        isDisabled: true,
        col: 4,
        order: 1,
        label: 'Mã nhân viên',
        objectMappingIn: 'employeeCode',
        mandatory: false,
      },
      {
        name: 'firstName',
        objectMappingIn: 'employeeDTO.firstName',
        type: FieldType.Text,
        show: true,
        isDisabled: true,
        col: 4,
        order: 2,
        label: 'FirstName',
        mandatory: false,
      },
      {
        name: 'lastName',
        objectMappingIn: 'employeeDTO.lastName',
        type: FieldType.Text,
        show: true,
        isDisabled: true,
        col: 4,
        order: 3,
        label: 'LastName',
        mandatory: false,
      },
      {
        name: 'companyEmail',
        objectMappingIn: 'employeeDTO.companyEmail',
        type: FieldType.Text,
        show: true,
        isDisabled: true,
        col: 4,
        order: 4,
        label: 'Email',
        mandatory: false,
      },
      {
        name: 'phone',
        objectMappingIn: 'employeeDTO.phone',
        type: FieldType.Text,
        show: true,
        isDisabled: true,
        col: 4,
        order: 5,
        label: 'Số điện thoại',
        mandatory: false,
      },
      {
        name: 'startDate',
        objectMappingIn: 'startDate',
        type: FieldType.Date,
        show: true,
        isDisabled: true,
        col: 4,
        order: 6,
        label: 'Ngày bắt đầu nghỉ',
        mandatory: false,
      },
      {
        name: 'endDate',
        objectMappingIn: 'endDate',
        type: FieldType.Date,
        show: true,
        isDisabled: true,
        col: 4,
        order: 7,
        label: 'Ngày kết thúc nghỉ',
        mandatory: false,
      },
      {
        name: 'reason',
        objectMappingIn: 'reason',
        type: FieldType.TextArea,
        show: true,
        isDisabled: true,
        col: 12,
        order: 8,
        label: 'Lý do',
        mandatory: false,
      },
    ];
    this.initForm();
  }

  initForm() {
    this.form = this.fb!.group({});
    this.listField.forEach((item) => {
      this.form.addControl(
        item.name,
        this.fb!.control({
          value: convertDataField(get(this.data, item.objectMappingIn!), item.type),
          disabled: item.isDisabled,
        })
      );
    });
    if (this.screenType === ScreenType.Detail) {
      this.form.disable();
    }
  }
}
