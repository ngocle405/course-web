import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { pages } from './pages';
import { NewRoutingModule } from './new-routing.module';

@NgModule({
  declarations: [...pages],
  imports: [SharedModule, NewRoutingModule],
})
export class NewModule {}
