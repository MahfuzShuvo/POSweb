import { VMProduct } from './VM/vmProduct';
import { BaseModel } from './baseModel';
import { Product } from './product';

export class Purchase extends BaseModel {
    PurchaseID: number;
    PurchaseCode: string;
    SupplierID!: number;
    PurchasePrice!: number;
    OtherCharge!: number;
    DiscountType!: number;
    Discount!: number;
    PaymentType!: number;
    PaymentAmount!: number;
    PaymentNote: string;
    lstProduct: VMProduct[] = [];
}