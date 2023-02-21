import { BaseModel } from './baseModel';
export class Product extends BaseModel {
    ProductID: number;
    ProductName: string;
    Description: string;
    SKU: string;
    Image: string;
    Unit!: number;
    CategoryID!: number;
    BrandID!: number;
    Qty!: number;
    MinQty!: number;
    Cost!: number;
    Price!: number;
    PurchasePrice!: number;
    SellingPrice!: number;
    FinalPrice!: number;
    ProfitMargin!: number;
    TaxType!: number;
    Tax!: number;
    Discount!: number;
}