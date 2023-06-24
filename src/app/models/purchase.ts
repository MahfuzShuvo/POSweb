import { VMProduct } from './VM/vmProduct';
import { BaseModel } from './baseModel';

export class Purchase extends BaseModel {
    PurchaseID: number;
    PurchaseCode: string;
    PurchaseDate: string;
    PurchaseStatus: number = 1;
    SupplierID!: number;
    SubTotal: number = 0;
    TotalPurchasePrice: number = 0;
    OtherCharge: number = 0;
    DiscountType: number = 1;
    Discount: number = 0;
    PaymentType: number = 0;
    PaymentAmount: number = 0;
    DueAmount: number = 0;
    PaymentNote: string;
    lstProduct: VMProduct[] = [];
}