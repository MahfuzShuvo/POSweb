import { Injectable } from '@angular/core';
import { HttpHelper } from '../common/helper/httpHelper';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CouponService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllCoupon(): Observable<any> {
		const url = 'api/Coupon/GetAllCoupon';
		return this.httpHelper.postHelper(url);
	}

	saveCoupon(obj: any): Observable<any> {
		const url = 'api/Coupon/SaveCoupon';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteCoupon(obj: any): Observable<any> {
		const url = 'api/Coupon/DeleteCoupon';
		return this.httpHelper.postHelper(url, obj);
	}

}
