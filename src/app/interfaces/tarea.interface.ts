export interface TareaData {
  TaskId?: number;
  Name: string;
  Description: string;
  dateDue: Date;
  PriorityId: number;
  StatusId?: number;
  ProjectId?: number;
  EmployeeId?: number;
}
