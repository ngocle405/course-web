import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTable } from '@cores/models/data-table.model';
import { mapDataTable } from '@cores/utils/common-functions';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/app/core/services/base.service';
import { environment } from 'src/environments/environment';
import { TaskModel } from '../models/task-model';
@Injectable({
  providedIn: 'root',
})
export class TaskService extends BaseService<TaskModel> {
  constructor(http: HttpClient) {
    super(http, `${environment.endpoint_url}/employees/leave-of-absence`);
  }

  getStepByTask(taskId: string, processId: string): Observable<any> {
    return this.http.get(`${environment.endpoint_url}/tasks/step-by-task?taskId=${taskId}&processId=${processId}`);
  }

  getTasksByProcess(params?: TaskModel): Observable<DataTable<TaskModel>> {
    return this.http
      .get<DataTable<TaskModel>>(`${environment.endpoint_url}/processes/${params!.processId!}/tasks`)
      .pipe(map((data) => mapDataTable(data, params)));
  }

  getTaskByUser(): Observable<any> {
    return this.http.get(`${environment.endpoint_url}/tasks/get-task`);
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get(`${environment.endpoint_url}/tasks/${id}`);
  }
}
