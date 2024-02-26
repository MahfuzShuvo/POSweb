export class VMProduct {
    ProductName: string;
    Description: string;
    SKU: string;
    Slug: string;
    Image: string;
    PurchasePrice!: number;
    FinalPrice!: number;
    Qty: number = 1;
    MinQty!: number;
    Status!: number;
    CategoryName: string;
    BrandName: string;
    UnitName: string;
    BranchID: number;
    CategoryID: number;
}

export class VMProductSearch {
    SearchText: string = '';
    BranchID: number;
}