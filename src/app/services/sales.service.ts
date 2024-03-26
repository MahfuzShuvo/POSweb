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

	getAllSales(obj: any): Observable<any> {
		const url = 'api/Sales/GetAllSales';
		return this.httpHelper.postHelper(url, obj);
	}
	getAllHoldSales(obj: any): Observable<any> {
		const url = 'api/Sales/GetAllHoldSales';
		return this.httpHelper.postHelper(url, obj);
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

	getSaleForExport(obj: any): Observable<any> {
		const url = 'api/Sales/GetSaleForExport';
		return this.httpHelper.postHelper(url, obj);
	}
}
