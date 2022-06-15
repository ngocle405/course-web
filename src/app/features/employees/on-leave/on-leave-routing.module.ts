import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnLeaveListComponent } from './pages';

const routes: Routes = [
  {
    path: 'list',
    component: OnLeaveListComponent,
  },
  {
    path: '',
    redirectTo: 'list',
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnLeaveRoutingModule {}
