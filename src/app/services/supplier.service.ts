import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class SupplierService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllSupplier(): Observable<any> {
		const url = 'api/Supplier/GetAllSupplier';
		return this.httpHelper.postHelper(url);
	}

	saveSupplier(obj: any): Observable<any> {
		const url = 'api/Supplier/SaveSupplier';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteSupplier(obj: any): Observable<any> {
		const url = 'api/Supplier/DeleteSupplier';
		return this.httpHelper.postHelper(url, obj);
	}


}
