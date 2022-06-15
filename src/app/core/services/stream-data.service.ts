import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamDataService {
  private requestSource = new Subject<any>();

  // Observable string streams
  data$ = this.requestSource.asObservable();

  // Service message commands
  passData(key: string, value: any, functionCode?: string) {
    const observable: any = {
      key,
      value,
    };
    if (functionCode) {
      observable.functionCode = functionCode;
    }
    this.requestSource.next(observable);
  }
}
