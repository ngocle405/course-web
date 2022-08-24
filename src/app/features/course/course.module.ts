import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { pages } from './pages';
import { CourseRoutingModule } from './course-routing.module';
import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [...pages, ...components],
  imports: [SharedModule, CourseRoutingModule,NgxPaginationModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class CourseModule {}
