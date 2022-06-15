import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseDescriptionComponent, CourseListComponent } from './pages';

const routes: Routes = [
  {
    path: 'list',
    component: CourseListComponent,
  },
  {
    path: 'description/:courseId',
    component: CourseDescriptionComponent,
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
