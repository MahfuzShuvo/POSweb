export class AccountStatement {
    AccountStatementID: number;
    AccountID: number;
    ExpenseID: number;
    InBalance: number = 0;
    OutBalance: number = 0;
    Balance: number = 0;
    CreatedBy: number;
    CreatedDate: Date;
}