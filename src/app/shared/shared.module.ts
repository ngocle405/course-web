import { CommonModule, Location } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicModule } from 'ng-dynamic-component';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AvatarModule } from 'primeng/avatar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { components } from './components';
import { layouts } from './layouts';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { PickListModule } from 'primeng/picklist';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { directives } from './directives';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxPaginationModule } from 'ngx-pagination';

const COMPONENTS = [...components, ...layouts];
const PIPES: never[] = [];
const DIRECTIVES = [...directives];

const MODULES = [
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  DynamicModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  CalendarModule,
  AvatarModule,
  PanelMenuModule,
  InputMaskModule,
  InputNumberModule,
  DropdownModule,
  InputTextareaModule,
  MultiSelectModule,
  CalendarModule,
  ToolbarModule,
  TableModule,
  FileUploadModule,
  PaginatorModule,
  BreadcrumbModule,
  DynamicDialogModule,
  ConfirmPopupModule,
  ConfirmDialogModule,
  ToastModule,
  DialogModule,
  RadioButtonModule,
  InputSwitchModule,
  OrganizationChartModule,
  StepsModule,
  PickListModule,
  MenubarModule,
  OverlayPanelModule,
  SplitButtonModule,
  TimelineModule,
  CardModule,
  ProgressSpinnerModule,
  ImageModule,
];

@NgModule({
  imports: [CommonModule, ...MODULES,NgxPaginationModule],
  exports: [CommonModule, ...PIPES, ...COMPONENTS, ...DIRECTIVES, ...MODULES],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  providers: [Location, DynamicDialogRef, DynamicDialogConfig],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
