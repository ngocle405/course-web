import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoadingComponent {
  @HostBinding('class') hostClass = 'app-loading';
  constructor() {}
}
