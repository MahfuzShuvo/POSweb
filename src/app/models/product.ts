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
    ExpireDateString!: string;
    Qty: number = 0;
    MinQty: number = 0;
    Cost: number;
    Price: number = 0;
    PurchasePrice: number = 0;
    SellingPrice: number = 0;
    FinalPrice: number = 0;
    ProfitMargin: number = 0;
    TaxType: number = 1;
    Tax: number = 0;
    Discount: number;
    DiscountType: number = 0;
    Attachment: VMAttachment = new VMAttachment();
}