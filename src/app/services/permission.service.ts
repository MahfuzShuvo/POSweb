import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class PermissionService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllPermission(): Observable<any> {
		const url = 'api/Permission/GetAllPermission';
		return this.httpHelper.postHelper(url);
	}

	savePermission(obj: any): Observable<any> {
		const url = 'api/Permission/SavePermission';
		return this.httpHelper.postHelper(url, obj);
	}

	deletePermission(obj: any): Observable<any> {
		const url = 'api/Permission/DeletePermission';
		return this.httpHelper.postHelper(url, obj);
	}

}
