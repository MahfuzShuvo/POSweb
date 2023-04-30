import { Injectable } from '@angular/core';
import { HttpHelper } from '../common/helper/httpHelper';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UnitService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllUnit(): Observable<any> {
		const url = 'api/Unit/GetAllUnit';
		return this.httpHelper.postHelper(url);
	}

	saveUnit(obj: any): Observable<any> {
		const url = 'api/Unit/SaveUnit';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteUnit(obj: any): Observable<any> {
		const url = 'api/Unit/DeleteUnit';
		return this.httpHelper.postHelper(url, obj);
	}

}
