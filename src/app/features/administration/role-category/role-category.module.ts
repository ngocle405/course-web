import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoleCategoryRoutingModule } from './role-category-routing.module';
import { components } from './components';
import { pages } from './pages';
import { RoleActionComponent } from './components/role-action/role-action.component';

@NgModule({
  imports: [RoleCategoryRoutingModule, SharedModule],
  declarations: [...pages, ...components, RoleActionComponent],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class RoleCategoryModule {}
