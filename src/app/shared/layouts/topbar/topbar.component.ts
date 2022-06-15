import { Component, OnInit } from '@angular/core';
import { SessionService } from '@cores/services/session.service';
import { SessionKey } from '@cores/utils/enums';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
  constructor(private sessionService: SessionService) {}
  fullName?: string;

  ngOnInit() {
    const interval = setInterval(() => {
      const user = this.sessionService.getSessionData(SessionKey.UserProfile);
      if (user) {
        this.fullName = `${user.firstName} ${user.lastName}`;
        clearInterval(interval);
      }
    });
  }

  logout() {}
}
