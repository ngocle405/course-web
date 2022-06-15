import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { EmployeeService } from '@on-leave/services/employee.service';

import { Observable } from 'rxjs';
import { APP_LOADING } from '../utils/constants';
import { SessionService } from './session.service';
import { StreamDataService } from './stream-data.service';

@Injectable({
  providedIn: 'root',
})
export class GuardService implements CanActivate {
  constructor(
    private streamData: StreamDataService,
    private sessionService: SessionService,

    private employeeService: EmployeeService
  ) {}
  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((_observable) => {
      //   this.employeeService
      //     .getInfoEmployee(this.keycloakService.getUsername()?.toUpperCase())
      //     .pipe(catchError(() => of({})))
      //     .subscribe({
      //       next: (data) => {

      //        this.sessionService.setSessionData(SessionKey.UserProfile, data);
      this.streamData.passData(APP_LOADING, true);
      return _observable.next(true);

      //       },
      //     });
    });
  }
}
