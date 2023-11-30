import { TareasData } from './tareas.interface';

export interface ProyectoData {
  projectId?: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  statusId: number;
  clientId: number;
  tasks: TareasData[];
}
