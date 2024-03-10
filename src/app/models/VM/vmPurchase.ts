import { Supplier } from "../supplier";
import { VMProduct } from "./vmProduct";

export class VMPurchase {
    PurchaseCode: string;
    // ProductSKUs: string;
    PurchaseDate: string;
    BranchID: number;
    SubTotal: number;
    TotalPurchasePrice: number;
    OtherCharge: number;
    DiscountType: string;
    Discount: number;
    AccountTitle: string;
    PaymentAmount: number;
    DueAmount: number;
    PaymentStatus: string;
    PaymentNote: string;
    PurchaseStatus: string;
    CreatedDate: string;
    SupplierName: string;
    CreatedByName: string;
    lstProduct: VMProduct[] = [];
    objSupplier: Supplier = new Supplier();
}