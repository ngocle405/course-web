import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'common-category',
    loadChildren: () => import('./common-category/common-category.module').then((m) => m.CommonCategoryModule),
  },
  {
    path: 'role',
    loadChildren: () => import('./role-category/role-category.module').then((m) => m.RoleCategoryModule),
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
