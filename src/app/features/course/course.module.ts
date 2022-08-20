import { NgModule } from '@angular/core';
import { pages } from './pages';
import { CourseRoutingModule } from './course-routing.module';
import { SharedModule } from '@shared/shared.module';
import { components } from './components';

@NgModule({
  declarations: [...pages, ...components],
  imports: [SharedModule, CourseRoutingModule],
})
export class CourseModule {}
