import { Component, Injector } from '@angular/core';
import { ProcessService } from 'src/app/features/administration/config-process/services/process.service';
import { BaseComponent } from '@shared/components';
import { size } from 'lodash';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './upload-file-deploy.component.html',
  styleUrls: ['./upload-file-deploy.component.scss'],
})
export class UploadFileDeployComponent extends BaseComponent {
  constructor(injector: Injector, private service: ProcessService) {
    super(injector);
    this.loadingService.start();
  }

  uploadHandler(event: any, el: FileUpload, type: string) {
    if (size(event.files) > 0) {
      this.messageService?.confirm().subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.loadingService.start();
          const data: FormData = new FormData();
          data.append('file', event.files[0]);
          let api: Observable<any>;
          if (type === 'bpm') {
            api = this.service.uploadFileBPM(data);
          } else {
            api = this.service.uploadFileDrools(data);
          }
          api.subscribe({
            next: () => {
              el.clear();
              this.loadingService.complete();
              this.messageService?.success('Thực hiện thành công');
            },
            error: () => {
              this.loadingService.complete();
              this.messageService?.error('Thực hiện không thành công');
            },
          });
        }
      });
    }
  }
}
