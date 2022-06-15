import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { StreamDataService } from './core/services/stream-data.service';
import { APP_LOADING } from './core/utils/constants';

@Component({
  selector: 'app-root',
  template: `
    <app-loading *ngIf="!loaded"></app-loading>
    <router-outlet *ngIf="loaded"></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  loaded = false;
  constructor(private primeNGConfig: PrimeNGConfig, private streamData: StreamDataService) {
    this.streamData.data$.subscribe((data) => {
      if (data.key === APP_LOADING) {
        this.loaded = true;
      }
    });
  }

  ngOnInit() {
    this.primeNGConfig.ripple = true;
  }
}
