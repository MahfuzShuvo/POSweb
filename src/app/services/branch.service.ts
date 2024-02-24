import { Injectable } from '@angular/core';
import { HttpHelper } from '../common/helper/httpHelper';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BranchService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllBranch(): Observable<any> {
		const url = 'api/Branch/GetAllBranch';
		return this.httpHelper.postHelper(url);
	}

	saveBranch(obj: any): Observable<any> {
		const url = 'api/Branch/SaveBranch';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteBranch(obj: any): Observable<any> {
		const url = 'api/Branch/DeleteBranch';
		return this.httpHelper.postHelper(url, obj);
	}

	assignToBranch(obj: any): Observable<any> {
		const url = 'api/Branch/AssignUserToBranch';
		return this.httpHelper.postHelper(url, obj);
	}
	removeFromBranch(obj: any): Observable<any> {
		const url = 'api/Branch/RemoveUserFromBranch';
		return this.httpHelper.postHelper(url, obj);
	}

}
