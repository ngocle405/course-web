import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonCategoryRoutingModule } from './common-category-routing.module';
import { components } from './components';
import { pages } from './pages';

@NgModule({
  imports: [CommonCategoryRoutingModule, SharedModule],
  declarations: [...pages, ...components],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CommonCategoryModule {}
