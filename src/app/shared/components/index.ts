import { BaseComponent } from './base.component';
import { BaseActionComponent } from './base-action.component';
import { BaseTableComponent } from './base-table.component';
import { LoadingComponent } from './loading/loading.component';
import { ConfirmDialogComponent } from './confirm/confirm.component';
import { ErrorComponent } from './f-errors/f-errors.component';

export const components = [
  BaseComponent,
  LoadingComponent,
  ConfirmDialogComponent,
  BaseTableComponent,
  BaseActionComponent,
  ErrorComponent,
];

export * from './base.component';
export * from './loading/loading.component';
export * from './confirm/confirm.component';
export * from './base-table.component';
export * from './base-action.component';
export * from './f-errors/f-errors.component';
