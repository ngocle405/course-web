import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldProcessConfigComponent, StepProcessConfigComponent, UploadFileDeployComponent } from './pages';
const routes: Routes = [
  {
    path: 'steps',
    component: StepProcessConfigComponent,
  },
  {
    path: 'fields',
    component: FieldProcessConfigComponent,
  },
  {
    path: 'upload-file-deploy',
    component: UploadFileDeployComponent,
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationProcessRoutingModule {}
