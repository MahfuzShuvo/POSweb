import { BaseModel } from './baseModel';
export class Customer extends BaseModel {
    CustomerID: number;
    CustomerName: string;
    PhoneNumber: string;
    Email: string;
    City: string;
    State: string;
    Zip: string;
    Address: string;
}