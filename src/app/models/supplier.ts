import { BaseModel } from './baseModel';
export class Supplier extends BaseModel {
    SupplierID: number;
    SupplierName: string;
    PhoneNumber: string;
    Email: string;
    City: string;
    State: string;
    Zip: string;
    Address: string;
}