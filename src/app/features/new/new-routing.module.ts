import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewDescriptionComponent, NewListComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: NewListComponent,
  },
  {
    path: 'description/:newId',
    component: NewDescriptionComponent,
  },

  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewRoutingModule {}
