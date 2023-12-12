import { ContactosData } from './contacto.interface';

export interface ProveedorData {
  imageURL?: string;
  providerId?: number;
  identifierId: number;
  identifier: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  details: string;
  contacts: ContactosData[];
}
