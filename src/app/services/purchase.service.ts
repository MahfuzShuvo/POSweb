import { Injectable } from '@angular/core';
import { HttpHelper } from '../common/helper/httpHelper';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PurchaseService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllPurchase(obj: any): Observable<any> {
		const url = 'api/Purchase/GetAllPurchase';
		return this.httpHelper.postHelper(url, obj);
	}

	getPurchaseByPurchaseCode(obj: any): Observable<any> {
		const url = 'api/Purchase/GetPurchaseByPurchaseCode';
		return this.httpHelper.postHelper(url, obj);
	}

	getPurchaseByPurchaseCodeForView(obj: any): Observable<any> {
		const url = 'api/Purchase/GetPurchaseByPurchaseCodeForView';
		return this.httpHelper.postHelper(url, obj);
	}

	savePurchase(obj: any): Observable<any> {
		const url = 'api/Purchase/SavePurchase';
		return this.httpHelper.postHelper(url, obj);
	}

	deletePurchase(obj: any): Observable<any> {
		const url = 'api/Purchase/DeletePurchase';
		return this.httpHelper.postHelper(url, obj);
	}
}
