export interface UsuarioData {
    userId?: number;
    identifierId: number;
    identification: number;
    name: string;
    lastname: string;
    secondLastname: string;
    phone : string;
    email: string;
    password: string;
    employeeId?: number;
    position: string;
    assignedProject?: number;
    clientId?: number;
    roleId: number;
  }