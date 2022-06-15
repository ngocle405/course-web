import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Message } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import { NotifyMessageType } from '../utils/enums';

@Injectable({
  providedIn: 'root',
})
export class NotificationMessageService implements OnDestroy {
  subjectMessage = new Subject<Message>();
  subjectDialog = new Subject<any>();
  options: Message = {
    summary: 'Thông báo',
    life: 10000,
  };
  constructor(private http1: HttpClient) {}

  success(message: string, isDialog?: boolean) {
    if (!isDialog) {
      this.show({ severity: NotifyMessageType.Success, detail: message, ...this.options });
    }
  }

  error(message: string, isDialog?: boolean) {
    if (!isDialog) {
      this.show({ severity: NotifyMessageType.Error, detail: message, ...this.options });
    }
  }

  info(message: string, isDialog?: boolean) {
    if (!isDialog) {
      this.show({ severity: NotifyMessageType.Info, detail: message, ...this.options });
    }
  }

  warn(message: string, isDialog?: boolean) {
    if (!isDialog) {
      this.show({ severity: NotifyMessageType.Warn, detail: message, ...this.options });
    }
  }

  confirm(): Observable<any> {
    this.subjectDialog.next({ key: 'confirm' });
    return new Observable<any>((observer) => {
      const sub: Subscription = this.subjectDialog.subscribe((res) => {
        sub.unsubscribe();
        return observer.next(res.key === 'accept');
      });
    });
  }

  confirmApproved(): Observable<any> {
    this.subjectDialog.next({ key: 'confirmApproved' });
    return new Observable<any>((observer) => {
      const sub: Subscription = this.subjectDialog.subscribe((res) => {
        sub.unsubscribe();
        return observer.next({ isConfirm: res.key === 'accept', data: res.data });
      });
    });
  }

  confirmReject(): Observable<any> {
    this.subjectDialog.next({ key: 'confirmReject' });
    return new Observable<any>((observer) => {
      const sub: Subscription = this.subjectDialog.subscribe((res) => {
        sub.unsubscribe();
        return observer.next({ isConfirm: res.key === 'accept', data: res.data });
      });
    });
  }

  show(notify: Message) {
    this.subjectMessage.next(notify);
  }

  ngOnDestroy(): void {
    this.subjectDialog.unsubscribe();
    this.subjectMessage.unsubscribe();
  }
}
