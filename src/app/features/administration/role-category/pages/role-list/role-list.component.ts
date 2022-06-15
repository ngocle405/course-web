import { Component, Injector, OnInit } from '@angular/core';
import { BaseTableComponent } from '@shared/components';
import { RoleActionComponent } from '../../components';
import { RoleModel } from '../../models/role.model';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent extends BaseTableComponent<RoleModel> implements OnInit {
  constructor(injector: Injector, service: RoleService) {
    super(injector, service);
  }
  override params: RoleModel = {
    code: '',
    name: '',
  };

  override initConfigAction() {
    this.configAction = {
      component: RoleActionComponent,
      title: 'Danh mục nhóm người dùng',
      dialog: {
        width: '85%',
      },
    };
  }
  override mapDataSearch(): RoleModel {
    return { page: this.dataTable.currentPage, size: this.dataTable.size, ...this.params };
  }

  ngOnInit() {
    this.getState();
  }
}
