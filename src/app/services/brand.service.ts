import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class BrandService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllBrand(): Observable<any> {
		const url = 'api/Brand/GetAllBrand';
		return this.httpHelper.postHelper(url);
	}

	saveBrand(obj: any): Observable<any> {
		const url = 'api/Brand/SaveBrand';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteBrand(obj: any): Observable<any> {
		const url = 'api/Brand/DeleteBrand';
		return this.httpHelper.postHelper(url, obj);
	}
}
