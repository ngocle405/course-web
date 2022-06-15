import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(public ref: DynamicDialogRef) {}

  confirm(isConfirm: boolean) {
    this.ref.close(isConfirm);
  }
}
