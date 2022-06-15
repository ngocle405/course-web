import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { v4 as uuIdv4 } from 'uuid';
import * as _ from 'lodash';
import { StreamDataService } from 'src/app/core/services/stream-data.service';
import { flattenTreeData, getNodeMenuByUrl } from 'src/app/core/utils/common-functions';
import { MenuModel } from '@cores/models/menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('toggleMenu', [
      transition(':enter', [style({ visibility: 'visible', height: 0 }), animate(`${150}ms ease-in`)]),
      transition(':leave', [animate(`${150}ms ease-out`, style({ visibility: 'hidden', height: 0 }))]),
    ]),
  ],
})
export class AppMenuComponent implements OnInit {
  constructor(private router: Router, private streamData: StreamDataService) {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        const item = getNodeMenuByUrl({ children: this.items }, this.router.url);
        this.activeMenuItem(item);
      }
    });
  }

  @Output() staticMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  classMenu = 'layout-sidebar';
  items: MenuModel[] = [];
  listItemMenuFlatten: any[] = [];
  isLock = false;

  ngOnInit() {
    this.items = [
      {
        id: uuIdv4(),
        label: 'Dashboard',
        icon: 'pi-home',
        routerLink: '/bpm/dashboard',
        active: false,
        path: null,
      },
      // {
      //   id: uuIdv4(),
      //   label: 'Quản trị',
      //   icon: 'pi-sitemap',
      //   active: false,
      //   path: null,
      //   children: [
      //     {
      //       path: '[2]',
      //       id: uuIdv4(),
      //       label: 'Cấu hình quy trình',
      //       icon: 'pi-sign-in',
      //       active: false,
      //       children: [
      //         {
      //           id: uuIdv4(),
      //           path: '[2].children[0]',
      //           label: 'Cấu hình Field',
      //           icon: 'pi-sign-in',
      //           routerLink: '/bpm/administration/configuration-workflow/fields',
      //           active: false,
      //         },
      //         {
      //           id: uuIdv4(),
      //           path: '[2].children[0]',
      //           label: 'Cấu hình Step',
      //           icon: 'pi-sign-in',
      //           routerLink: '/bpm/administration/configuration-workflow/steps',
      //           active: false,
      //         },
      //         {
      //           id: uuIdv4(),
      //           path: '[2].children[0]',
      //           label: 'Upload file deploy',
      //           icon: 'pi-sign-in',
      //           routerLink: '/bpm/administration/configuration-workflow/upload-file-deploy',
      //           active: false,
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        id: uuIdv4(),
        label: 'Quản lý yêu cầu',
        icon: 'pi-star',
        active: false,
        routerLink: '/bpm/requests/request-list',
        path: null,
      },
      {
        id: uuIdv4(),
        label: 'Tạo yêu cầu',
        icon: 'pi-star',
        active: false,
        path: null,
        children: [
          {
            id: uuIdv4(),
            path: '[2]',
            label: 'Yêu cầu PCM',
            icon: 'pi-sign-in',
            routerLink: '/bpm/requests/contractManagement',
            active: false,
          },
          {
            id: uuIdv4(),
            path: '[2]',
            label: 'Yêu cầu Refund',
            icon: 'pi-sign-in',
            routerLink: '/bpm/create-requests/refund',
            active: false,
          },
        ],
      },
      {
        id: uuIdv4(),
        label: 'Lịch Sử',
        icon: 'pi-clock',
        active: false,
        routerLink: '/bpm/history/history-list',
        path: null,
      },
    ];
    this.streamData.passData('menu', this.items);
    this.listItemMenuFlatten = flattenTreeData(this.items);
  }

  mouseEnterMenu() {
    this.classMenu = 'layout-sidebar layout-sidebar-active';
  }

  mouseLeaveMenu() {
    this.classMenu = 'layout-sidebar';
  }

  activeMenuItem(itemActive: any) {
    if (itemActive) {
      const isActive: boolean = itemActive?.active || false;
      _.get(this.items, `${itemActive?.path}.children`, this.items).forEach((item: any) => {
        item.active = false;
      });
      itemActive.active = !isActive;
    }
  }

  isShowClass(url: string) {
    return this.router.url.includes(url);
  }

  onStaticMenu() {
    this.isLock = !this.isLock;
    this.staticMenu.emit(this.isLock);
  }
}
