import { BaseModel } from './baseModel';
export class Purchase extends BaseModel {
    PurchaseID: number;
    ProductID!: number;
    Qty!: number;
    Price!: number;
    Discount!: number;
}