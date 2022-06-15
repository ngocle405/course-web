export interface TaskModel {
  id?: number;
  taskName?: string;
  processName?: string;
  createdUser?: string;
  assignee?: string;
  processId?: string;
  status?: string;
  employeeCode?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  createTime?: Date | null;
  startApprovedDateFinal?: Date | null;
  endApprovedDateFinal?: Date | null;
  approverFinal?: string;
  page?: number;
  size?: number;
}
