import { ProveedorData } from "./proveedor.interface";

export interface catalogoProveedorData {
  imageURL?: any;
  itemId?: number;
  name: string;
  details: string;
  price: number;
  providerId?: string;
  unitId: number;
  quantity: number | null;
  provider?: ProveedorData
}
