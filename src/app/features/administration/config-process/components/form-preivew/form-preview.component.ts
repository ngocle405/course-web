import { Component, Injector, OnInit } from '@angular/core';
import { FieldModel } from 'src/app/features/administration/config-process/models/field.model';
import { BaseComponent } from '@shared/components';
import { get, orderBy } from 'lodash';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldType } from 'src/app/core/utils/enums';

@Component({
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
})
export class FormPreviewComponent extends BaseComponent implements OnInit {
  constructor(injector: Injector, private refDialog: DynamicDialogRef, private configDialog: DynamicDialogConfig) {
    super(injector);
  }

  listField: FieldModel[] = [];
  fieldType = FieldType;
  form = this.fb!.group({});
  title?: string;

  ngOnInit(): void {
    this.title = this.configDialog?.header;
    this.listField = orderBy(get(this.configDialog, 'data.listField', []), 'order');
    this.initForm();
  }

  initForm() {
    this.form = this.fb!.group({});
    this.listField.forEach((item) => {
      const value = this.form!.addControl(
        item.name,
        this.fb!.control({
          value: null,
          disabled: item.isDisabled,
        })
      );
    });
    this.form.disable();
  }

  cancel() {
    this.refDialog.close();
  }
}
