import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class RolePermissionMappingService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllRolePermissionMapping(): Observable<any> {
		const url = 'api/RolePermissionMapping/GetAllRolePermissionMapping';
		return this.httpHelper.postHelper(url);
	}

	saveRolePermissionMapping(obj: any): Observable<any> {
		const url = 'api/RolePermissionMapping/SaveRolePermissionMapping';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteRolePermissionMapping(obj: any): Observable<any> {
		const url = 'api/RolePermissionMapping/DeleteRolePermissionMapping';
		return this.httpHelper.postHelper(url, obj);
	}

}
