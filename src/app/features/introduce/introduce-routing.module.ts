import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroduceListComponent } from './page';

const routes: Routes = [
  {
    path: '',
    component: IntroduceListComponent,
  },

  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroduceRoutingModule {}
