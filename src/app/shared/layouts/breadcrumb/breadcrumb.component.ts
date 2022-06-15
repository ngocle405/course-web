import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { forEach, split, get } from 'lodash';
import { StreamDataService } from 'src/app/core/services/stream-data.service';
import { getNodeMenuByUrl } from 'src/app/core/utils/common-functions';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppBreadcrumbComponent implements OnInit {
  constructor(private router: Router, private streamData: StreamDataService, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.getData(this.router.url);
      }
    });
    this.streamData.data$.subscribe((data) => {
      if (data?.key === 'menu') {
        this.menu = data.value;
      }
    });
  }
  menu: any;
  items: any[] = [];

  home: any;
  ngOnInit() {
    this.getData(this.router.url);
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  getData(url: string) {
    const item = getNodeMenuByUrl({ children: this.menu }, url);
    this.items = [];
    if (item?.path) {
      const arrPath = split(item?.path, '.');
      forEach(arrPath, (value, i) => {
        let path = '';
        for (let index = 0; index < i + 1; index++) {
          path += arrPath[index] + (index < i ? '.' : '');
        }
        this.items.push({ label: get(this.menu, `${path}.label`) });
      });
    }
    this.items.push({ label: item?.label });
  }
}
