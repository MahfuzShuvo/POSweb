import { BaseModel } from './baseModel';
export class Invoice extends BaseModel {
    InvoiceID: number;
    CustomerID!: number;
    SalesCode: string;
    InvoiceCode: string;
    Price!: number;
    Discount!: number;
    PaymentType!: number;
    PaymentStatusID!: number;
}