export interface ProcessModel {
  id: string;
  name: string;
  appVersion?: string;
  version?: number;
  key?: string;
  category?: string;
  processId?: string;
  config?: string;
  userTaskId: string;
  status?: string[];
}
