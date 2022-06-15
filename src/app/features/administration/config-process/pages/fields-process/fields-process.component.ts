import { Component, HostBinding, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FieldConfigModel, FieldModel } from 'src/app/features/administration/config-process/models/field.model';
import { ProcessModel } from 'src/app/features/administration/config-process/models/process.model';
import { ProcessService } from 'src/app/features/administration/config-process/services/process.service';
import { validateAllFormFields } from '@cores/utils/common-functions';
import { FieldType } from '@cores/utils/enums';
import { BaseComponent } from '@shared/components';
import { forEach, trim, isEmpty, last } from 'lodash';

@Component({
  templateUrl: './fields-process.component.html',
  styleUrls: ['./fields-process.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FieldProcessConfigComponent extends BaseComponent implements OnInit {
  @HostBinding('class.fields-process-config') hostClass = true;
  constructor(injector: Injector, private service: ProcessService) {
    super(injector);
    this.loadingService.start();
  }

  listProcess: ProcessModel[] = [];
  listType = [
    { code: FieldType.Text, name: 'Text' },
    { code: FieldType.TextArea, name: 'TextArea' },
    { code: FieldType.Date, name: 'Calendar' },
  ];
  processKey: string | null = null;
  fields = this.fb!.array([]);

  ngOnInit() {
    this.service.getListProcess().subscribe({
      next: (data) => {
        this.listProcess = data;
        this.loadingService.complete();
      },
      error: () => {
        this.loadingService.complete();
      },
    });
  }

  save() {
    const fieldLast = last(this.fields.controls) as FormGroup;
    if (
      (!isEmpty(fieldLast.getRawValue().name) || !isEmpty(fieldLast.getRawValue().name)) &&
      fieldLast.status === 'INVALID'
    ) {
      validateAllFormFields(fieldLast);
      return;
    }
    if (this.processKey) {
      this.messageService?.confirm().subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.loadingService.start();
          const listField: FieldModel[] = this.fields.getRawValue();
          const data: FieldConfigModel[] = [];
          forEach(listField, (field) => {
            if (!isEmpty(trim(field.name))) {
              data.push({
                formKey: this.processKey!,
                label: field.label,
                name: field.name,
                format: {
                  col: field.col,
                  isDisabled: field.isDisabled,
                  show: field.show,
                  type: field.type,
                  mandatory: field.mandatory,
                  order: field.order,
                },
              });
            }
          });
          this.service.updateConfigFieldsProcess(this.processKey!, data).subscribe({
            next: () => {
              this.messageService?.success('Thực hiện thành công');
              this.loadingService.complete();
            },
            error: () => {
              this.messageService?.error('Thực hiện không thành công');
              this.loadingService.complete();
            },
          });
        }
      });
    }
  }

  addControlForm() {
    const control = this.fb!.group({
      id: null,
      name: ['', Validators.required],
      label: ['', Validators.required],
      type: FieldType.Text,
      show: false,
      order: 1,
      col: 4,
      mandatory: false,
      isDisabled: false,
    });
    this.fields.push(control);
  }

  addItem(form: FormGroup) {
    if (form.status === 'INVALID') {
      validateAllFormFields(form);
      return;
    }
    this.addControlForm();
  }

  deleteItem(index: number) {
    this.fields.removeAt(index);
  }

  onChangeWorkflow(event: any) {
    this.loadingService.start();
    this.service.getConfigFieldByProcessKey(this.processKey!).subscribe({
      next: (data) => {
        this.fields = this.fb!.array([]);
        forEach(data, (item) => {
          const control = this.fb!.group({
            name: [item.name, Validators.required],
            label: [item.label, Validators.required],
            type: item.format?.type || FieldType.Text,
            show: item.format?.show || false,
            order: item.format?.order || 1,
            col: item.format?.col || 4,
            mandatory: item.format?.mandatory || false,
            isDisabled: item.format?.isDisabled || false,
          });
          this.fields.push(control);
        });
        this.addControlForm();
        this.loadingService.complete();
      },
      error: () => {
        this.loadingService.complete();
      },
    });
  }
}
