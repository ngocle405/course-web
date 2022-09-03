import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@shared/components';
import * as _ from 'lodash';
import { NewModel } from '../../models/new.model';
import { NewService } from '../../service/new.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent extends BaseComponent implements OnInit {
  constructor(inject: Injector, private service: NewService) {
    super(inject);
  }

  stateData?: NewModel[];
  getAll() {
    this.loadingService.start();
    this.service.get('/new-list').subscribe({
      next: (data) => {
        this.stateData = _.orderBy(_.cloneDeep(data), ['createDate'], ['desc']);
        console.log(this.stateData);

        this.loadingService.complete();
      },
      error: (e) => {
        this.loadingService.complete();
        this.messageService?.error('Có lỗi xảy ra, vui lòng thử lại sau');
      },
    });
  }
  ngOnInit(): void {
    this.loadingService.start();
    this.getAll();
  }
}
