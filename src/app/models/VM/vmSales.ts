import { Customer } from "../customer";
import { VMProduct } from "./vmProduct";

export class VMSales {
    salesCode: string;
    salesDate: string;
    subTotal: number;
    totalSalesPrice: number;
    discountType: string;
    discount: number;
    accountTitle: string;
    payAmount: number;
    dueAmount: number;
    salesStatus: string;
    createdDate: string;
    customerName: string;
    createdByName: string;
    lstProduct: VMProduct[] = [];
    objCustomer: Customer = new Customer();
}