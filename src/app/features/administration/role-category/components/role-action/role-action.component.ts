import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseActionComponent } from '@shared/components';
import { ScreenType } from 'src/app/core/utils/enums';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-action',
  templateUrl: './role-action.component.html',
  styleUrls: ['./role-action.component.scss'],
})
export class RoleActionComponent extends BaseActionComponent implements OnInit {
  constructor(injector: Injector, service: RoleService) {
    super(injector, service);
  }
  override form = this.fb!.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    note: [''],
    updateBy: [''],
    updateDate: [''],
    createdBy: [''],
    createDate: [''],
    description: [''],
  });

  ngOnInit(): void {
    if (this.screenType === ScreenType.Detail) {
      this.form?.disable();
    } else if (this.screenType === ScreenType.Update) {
      this.form?.get('code')!.disable();
    }
    if (this.data && this.screenType !== ScreenType.Create) {
      this.data.startDate = this.data.startDate ? null : new Date(this.data.startDate);
      this.data.endDate = this.data.endDate ? null : new Date(this.data.endDate);
      this.form.patchValue(this.data);
    }
    this.form.valueChanges.subscribe((data) => {});
  }
}
