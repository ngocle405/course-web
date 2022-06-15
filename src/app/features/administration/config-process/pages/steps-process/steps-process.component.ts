import { Component, Injector, OnInit } from '@angular/core';
import { FieldModel } from 'src/app/features/administration/config-process/models/field.model';
import { ProcessModel } from 'src/app/features/administration/config-process/models/process.model';
import { ProcessService } from 'src/app/features/administration/config-process/services/process.service';
import { BaseComponent } from '@shared/components';
import { find, forEach } from 'lodash';
import { FormProcessModel } from 'src/app/features/administration/config-process/models/form-process.model';
import { forkJoin } from 'rxjs';
import { FieldType } from '@cores/utils/enums';
import { NgForm } from '@angular/forms';
import { FormPreviewComponent } from 'src/app/features/administration/config-process/components';

@Component({
  templateUrl: './steps-process.component.html',
  styleUrls: ['./steps-process.component.scss'],
})
export class StepProcessConfigComponent extends BaseComponent implements OnInit {
  constructor(injector: Injector, private service: ProcessService) {
    super(injector);
  }

  listProcess: ProcessModel[] = [];
  listForm: FormProcessModel[] = [];
  processKey: string | null = null;
  formKey: string | null = null;
  formName: string = '';
  listCols = [
    { code: 4, name: '1/3' },
    { code: 8, name: '2/3' },
    { code: 12, name: '3/3' },
  ];
  listField: FieldModel[] = [];
  showAll = false;
  disabledAll = false;
  requiredAll = false;

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

  onChangeWorkflow(event: any, type: string) {
    this.loadingService.start();
    if (type === 'process') {
      forkJoin([
        this.service.getListFormByProcessKey(this.processKey!),
        this.service.getConfigFieldByProcessKey(this.processKey!),
      ]).subscribe({
        next: ([listForm, listFieldConfig]) => {
          this.listField = [];
          forEach(listFieldConfig, (item) => {
            this.listField.push({
              name: item.name,
              label: item.label,
              col: item.format?.col || 4,
              isDisabled: item.format?.isDisabled || false,
              mandatory: item.format?.mandatory || false,
              show: item.format?.show || false,
              type: item.format?.type || FieldType.Text,
              order: item.format?.order || 1,
            });
          });
          this.listForm = listForm;

          this.loadingService.complete();
        },
        error: () => {
          this.loadingService.complete();
        },
      });
    } else {
      this.formName = find(this.listForm, (item) => item.formKey === this.formKey)!.name;
      this.service.getFormConfigByProcessKey(this.formKey!).subscribe({
        next: (data) => {
          forEach(this.listField, (item) => {
            const itemOld = find(data.properties, (i) => i.name === item.name);
            item.col = itemOld?.format?.col || 4;
            item.isDisabled = itemOld?.format?.isDisabled || false;
            item.mandatory = itemOld?.format?.mandatory || false;
            item.show = itemOld?.format?.show || false;
            item.type = itemOld?.format?.type || FieldType.Text;
            item.order = itemOld?.format?.order || 1;
            item.objectMappingIn = itemOld?.objectMappingIn;
            item.objectMappingOut = itemOld?.objectMappingOut;
          });
          this.loadingService.complete();
        },
        error: () => {
          this.loadingService.complete();
        },
      });
    }
  }

  save(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.messageService?.confirm().subscribe((isConfirm: boolean) => {
      if (isConfirm) {
        this.loadingService.start();
        const data: FormProcessModel = {
          formKey: this.formKey!,
          processKey: this.processKey!,
          name: this.formName,
          properties: [],
        };
        forEach(this.listField, (field) => {
          data.properties!.push({
            formKey: this.processKey!,
            label: field.label,
            name: field.name,
            objectMappingIn: field.objectMappingIn,
            objectMappingOut: field.objectMappingOut,
            format: {
              col: field.col,
              isDisabled: field.isDisabled,
              show: field.show,
              type: field.type,
              mandatory: field.mandatory,
              order: field.order,
            },
          });
        });
        this.service.updateFormConfig(data).subscribe({
          next: () => {
            this.loadingService.complete();
            this.messageService?.success('Thực hiện thành công');
          },
          error: () => {
            this.loadingService.complete();
            this.messageService?.error('Thực hiện không thành công');
          },
        });
      }
    });
  }

  preview() {
    this.dialogService?.open(FormPreviewComponent, {
      header: this.formName,
      showHeader: false,
      width: '85%',
      height: '90%',
      data: {
        listField: this.listField,
      },
    });
  }

  onChangeCheckAll(event: any, type: string) {
    if (type === 'showAll') {
      this.showAll = event.checked;
    } else if (type === 'requiredAll') {
      this.requiredAll = event.checked;
    } else {
      this.disabledAll = event.checked;
    }
    forEach(this.listField, (item) => {
      if (type === 'showAll') {
        item.show = event.checked;
      } else if (type === 'requiredAll') {
        item.mandatory = event.checked;
      } else {
        item.isDisabled = event.checked;
      }
    });
  }
}
