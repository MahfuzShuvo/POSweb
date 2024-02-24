import { VMProduct } from "./VM/vmProduct";
import { BaseModel } from "./baseModel";
import { Customer } from "./customer";

export class Sales extends BaseModel {
    SalesID: number;
    SalesCode: string;
    SalesDate: string;
    SalesStatus!: number;
    BranchID: number;
    CustomerID: number = 0;
    SubTotal: number = 0;
    TotalSalesPrice: number = 0;
    DiscountType: number = 0;
    Discount: number = 0;
    PayAmount: number = 0;
    DueAmount: number = 0;
    AccountID: number = 0;
    lstProduct: VMProduct[] = [];
    objCustomer: Customer = new Customer();
}