import { BaseModel } from './baseModel';
export class Expense extends BaseModel {
    ExpenseID: number;
    ExpenseTitle: string;
    BranchID: number;
    Description: string;
    Amount!: number;
    PurchaseID: number = 0;
    AccountID: number = 0;
}