import { Component, Injector, OnInit } from '@angular/core';
import { BaseTableComponent } from '@shared/components';
import { CategoryActionComponent } from '../../components';
import { CommonCategoryModel } from '../../models/common-category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent extends BaseTableComponent<CommonCategoryModel> implements OnInit {
  constructor(injector: Injector, service: CategoryService) {
    super(injector, service);
  }

  override initConfigAction() {
    this.configAction = {
      component: CategoryActionComponent,
      title: 'Nhóm danh mục dùng chung',
      dialog: {
        width: '85%',
      },
    };
  }

  ngOnInit() {
    this.getState();
  }
}
