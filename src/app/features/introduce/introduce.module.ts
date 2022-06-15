import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { pages } from './page';
import { IntroduceRoutingModule } from './introduce-routing.module';

@NgModule({
  declarations: [...pages],
  imports: [CommonModule, IntroduceRoutingModule],
})
export class IntroduceModule {}
