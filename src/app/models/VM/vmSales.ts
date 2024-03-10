import { Customer } from "../customer";
import { VMProduct } from "./vmProduct";

export class VMSales {
    SalesCode: string;
    SalesDate: string;
    BranchID: number;
    SubTotal: number;
    TotalSalesPrice: number;
    DiscountType: string;
    Discount: number;
    AccountTitle: string;
    PayAmount: number;
    DueAmount: number;
    Status: number = 1;
    SalesStatus: string;
    PaymentStatus: string;
    CreatedDate: string;
    CustomerName: string;
    CreatedByName: string;
    lstProduct: VMProduct[] = [];
    objCustomer: Customer = new Customer();
}