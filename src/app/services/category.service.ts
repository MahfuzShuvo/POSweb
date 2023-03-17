import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllCategory(): Observable<any> {
		const url = 'api/Category/GetAllCategory';
		return this.httpHelper.postHelper(url);
	}

	saveCategory(obj: any): Observable<any> {
		const url = 'api/Category/SaveCategory';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteCategory(obj: any): Observable<any> {
		const url = 'api/Category/DeleteCategory';
		return this.httpHelper.postHelper(url, obj);
	}
}
