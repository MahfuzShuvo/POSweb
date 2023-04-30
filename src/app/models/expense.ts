import { BaseModel } from './baseModel';
export class Expense extends BaseModel {
    ExpenseID: number;
    ExpenseTitle: string;
    Description: string;
    Amount!: number;
    AccountID: number = 0;
}