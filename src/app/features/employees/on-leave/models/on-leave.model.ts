export interface OnLeaveModel {
  id?: number;
  employeeCode?: string;
  employeeName?: string;
  reason?: string;
  status?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  approverFinal?: string;
  startApprovedDateFinal?: Date | null;
  endApprovedDateFinal?: Date | null;
  page?: number;
  size?: number;
}
