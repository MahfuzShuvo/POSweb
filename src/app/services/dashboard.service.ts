import { Injectable } from '@angular/core';
import { HttpHelper } from '../common/helper/httpHelper';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getDashboardInitialData(): Observable<any> {
		const url = 'api/Dashboard/GetDashboardInitialData';
		return this.httpHelper.postHelper(url);
	}

}
