import { Observable } from 'rxjs';
import { HttpHelper } from './../common/helper/httpHelper';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SecurityService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	register(obj: any): Observable<any> {
		const url = 'api/Security/Register';
		return this.httpHelper.postHelper(url, obj);
	}

	login(obj: any): Observable<any> {
		const url = 'api/Security/Login';
		return this.httpHelper.postHelper(url, obj);
	}

	logout(): Observable<any> {
		const url = 'api/Security/Logout';
		return this.httpHelper.postHelper(url);
	}
}
