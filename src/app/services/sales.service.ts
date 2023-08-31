import { Injectable } from '@angular/core';
import { HttpHelper } from '../common/helper/httpHelper';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SalesService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllSales(): Observable<any> {
		const url = 'api/Sales/GetAllSales';
		return this.httpHelper.postHelper(url);
	}

	getSalesBySalesCode(obj: any): Observable<any> {
		const url = 'api/Sales/GetSalesBySalesCode';
		return this.httpHelper.postHelper(url, obj);
	}

	getSalesBySalesCodeForView(obj: any): Observable<any> {
		const url = 'api/Sales/GetSalesBySalesCodeForView';
		return this.httpHelper.postHelper(url, obj);
	}

	saveSales(obj: any): Observable<any> {
		const url = 'api/Sales/SaveSales';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteSales(obj: any): Observable<any> {
		const url = 'api/Sales/DeleteSales';
		return this.httpHelper.postHelper(url, obj);
	}
}
