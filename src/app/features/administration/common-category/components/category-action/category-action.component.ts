import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { BaseActionComponent } from '@shared/components';
import { validateAllFormFields, cleanDataForm } from 'src/app/core/utils/common-functions';
import { CategoryService } from '../../services/category.service';
import { ScreenType } from 'src/app/core/utils/enums';
import { CommonCategoryModel, CommonModel } from '../../models/common-category.model';

@Component({
  templateUrl: './category-action.component.html',
  styleUrls: ['./category-action.component.scss'],
})
export class CategoryActionComponent extends BaseActionComponent implements OnInit {
  constructor(injector: Injector, service: CategoryService) {
    super(injector, service);
  }
  formListChildren = new FormArray([]);

  override form = this.fb!.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.screenType === ScreenType.Detail) {
      this.form?.disable();
    } else if (this.screenType === ScreenType.Update) {
      this.form?.get('code')!.disable();
    }
    if (this.data && this.screenType !== ScreenType.Create) {
      this.form.patchValue(this.data);
      this.data.commons?.forEach((item: CommonModel) => {
        const formChildren = this.fb!.group({
          code: ['', Validators.required],
          name: ['', Validators.required],
          value: ['', Validators.required],
          orderNum: ['', Validators.required],
          isDefault: '',
        });
        if (this.screenType === ScreenType.Detail) {
          formChildren.disable();
        }
        formChildren.patchValue(item);
        this.formListChildren.push(formChildren);
      });
    }
  }

  addNewFormChildren() {
    const formNewChildren = this.fb!.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      value: ['', Validators.required],
      orderNum: ['', Validators.required],
      isDefault: false,
    });
    this.formListChildren.push(formNewChildren);
  }

  override save() {
    let isValid = true;
    const dataList: any[] = [];
    for (const item of this.formListChildren.controls) {
      if (isValid && item.status === 'INVALID') {
        isValid = false;
      }
      const data: CommonCategoryModel = cleanDataForm(item as FormGroup);
      dataList.push(data);
      validateAllFormFields(item as FormGroup);
    }
    const data = this.getDataForm();
    data.commons = dataList;
    if (this.form?.status === 'VALID' && isValid) {
      this.messageService?.confirm().subscribe((isConfirm) => {
        if (isConfirm) {
          if (this.screenType === ScreenType.Create) {
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

  deleteItem(item: FormGroup) {
    const code = item.controls['code'].value;
    this.formListChildren.removeAt(this.formListChildren.value.findIndex((x: CommonModel) => x.code === code));
  }
}
