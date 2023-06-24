import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class RoleService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllRole(): Observable<any> {
		const url = 'api/Role/GetAllRole';
		return this.httpHelper.postHelper(url);
	}

	saveRole(obj: any): Observable<any> {
		const url = 'api/Role/SaveRole';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteRole(obj: any): Observable<any> {
		const url = 'api/Role/DeleteRole';
		return this.httpHelper.postHelper(url, obj);
	}
}
