import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDescriptionComponent } from './pages';
import { TeacherListComponent } from './pages/teacher-list/teacher-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: TeacherListComponent,
  },
  {
    path: 'description/:teacherId',
    component: TeacherDescriptionComponent,
  },

  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
