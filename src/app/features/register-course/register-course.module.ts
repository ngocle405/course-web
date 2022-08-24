import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { pages } from './pages';
import { SharedModule } from '@shared/shared.module';
import { RegisterCourseRoutingModule } from './register-course-routing.module';

@NgModule({
  declarations: [...pages],
  imports: [SharedModule, RegisterCourseRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterCourseModule {}
