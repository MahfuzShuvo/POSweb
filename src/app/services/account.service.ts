import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class AccountService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllAccount(obj: any): Observable<any> {
		const url = 'api/Account/GetAllAccount';
		return this.httpHelper.postHelper(url, obj);
	}

	saveAccount(obj: any): Observable<any> {
		const url = 'api/Account/SaveAccount';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteAccount(obj: any): Observable<any> {
		const url = 'api/Account/DeleteAccount';
		return this.httpHelper.postHelper(url, obj);
	}

	addBalance(obj: any): Observable<any> {
		const url = 'api/Account/AddBalance';
		return this.httpHelper.postHelper(url, obj);
	}

	showAccountStatement(obj: any): Observable<any> {
		const url = 'api/Account/ShowAccountStatement';
		return this.httpHelper.postHelper(url, obj);
	}
}
