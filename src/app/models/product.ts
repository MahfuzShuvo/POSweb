import { VMAttachment } from './VM/vmAttachment';
import { BaseModel } from './baseModel';
export class Product extends BaseModel {
    ProductID: number;
    ProductName: string;
    Description: string;
    SKU!: string;
    Slug!: string;
    Image: string;
    Unit: number;
    UnitName: string;
    CategoryID: number;
    BrandID: number;
    ExpireDate!: Date;
    Qty: number;
    MinQty: number;
    Cost: number;
    Price: number;
    PurchasePrice: number;
    SellingPrice: number;
    FinalPrice: number;
    ProfitMargin: number;
    TaxType: number = 1;
    Tax: number = 0;
    Discount: number;
    DiscountType: number = 0;
    Attachment: VMAttachment = new VMAttachment();
}