import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FieldConfigModel } from 'src/app/features/administration/config-process/models/field.model';
import { FormProcessModel } from 'src/app/features/administration/config-process/models/form-process.model';
import { ProcessModel } from 'src/app/features/administration/config-process/models/process.model';
import { StageProcess } from 'src/app/features/administration/config-process/models/stage-process.model';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(private http: HttpClient) {}

  getListProcess(): Observable<ProcessModel[]> {
    return this.http.get<ProcessModel[]>(`${environment.endpoint_url}/processes/definitions`);
  }

  getProcessById(id: string): Observable<ProcessModel> {
    return this.http.get<ProcessModel>(`${environment.endpoint_url}/processes/config/${id}`);
  }

  getConfigFieldByProcessKey(processKey: string): Observable<FieldConfigModel[]> {
    return this.http.get<FieldConfigModel[]>(`${environment.endpoint_url}/processes/properties-template/${processKey}`);
  }

  updateConfigFieldsProcess(processKey: string, data: FieldConfigModel[]) {
    return this.http.post(`${environment.endpoint_url}/processes/properties-template/${processKey}`, data);
  }

  getListFormByProcessKey(processKey: string): Observable<FormProcessModel[]> {
    return this.http.get<FormProcessModel[]>(
      `${environment.endpoint_url}/processes/form-config/${processKey}/drop-list`
    );
  }

  getFormConfigByProcessKey(formKey: string): Observable<FormProcessModel> {
    return this.http.get<FormProcessModel>(`${environment.endpoint_url}/processes/form-config/${formKey}`);
  }

  updateFormConfig(data: FormProcessModel): Observable<any> {
    return this.http.post(`${environment.endpoint_url}/processes/form-config/${data.formKey}`, data);
  }

  instanceProcess(processId: string): Observable<any> {
    return this.http.post(`${environment.endpoint_url}/processes/instances`, {
      processDefinitionId: processId,
    });
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get(
      `${environment.endpoint_url}/tasks/${taskId}?includeTaskLocalVariables=true&includeProcessVariables=true`
    );
  }

  nextStep(data: StageProcess): Observable<string> {
    return this.http.post(`${environment.endpoint_url}/processes/next-step`, data, {
      responseType: 'text',
    });
  }

  uploadFileBPM(data: FormData): Observable<any> {
    return this.http.post(`${environment.endpoint_url}/processes/deploy`, data);
  }

  uploadFileDrools(data: FormData): Observable<any> {
    return this.http.post(`${environment.endpoint_url}/processes/drools`, data);
  }
}
