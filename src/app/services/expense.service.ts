import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class ExpenseService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllExpense(): Observable<any> {
		const url = 'api/Expense/GetAllExpense';
		return this.httpHelper.postHelper(url);
	}

	saveExpense(obj: any): Observable<any> {
		const url = 'api/Expense/SaveExpense';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteExpense(obj: any): Observable<any> {
		const url = 'api/Expense/DeleteExpense';
		return this.httpHelper.postHelper(url, obj);
	}

}
