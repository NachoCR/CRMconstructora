import { TareaData } from './tarea.interface';

export interface ProyectoData {
  projectId?: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  statusId: number;
  clientId: number;
  tasks: TareaData[];
  imageURL?: string;
}
