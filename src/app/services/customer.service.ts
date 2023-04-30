import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class CustomerService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllCustomer(): Observable<any> {
		const url = 'api/Customer/GetAllCustomer';
		return this.httpHelper.postHelper(url);
	}

	saveCustomer(obj: any): Observable<any> {
		const url = 'api/Customer/SaveCustomer';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteCustomer(obj: any): Observable<any> {
		const url = 'api/Customer/DeleteCustomer';
		return this.httpHelper.postHelper(url, obj);
	}
}
