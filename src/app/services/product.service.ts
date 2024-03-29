import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	constructor(
		private httpHelper: HttpHelper
	) { }

	getAllProduct(): Observable<any> {
		const url = 'api/Product/GetAllProduct';
		return this.httpHelper.postHelper(url);
	}

	getProductCountByCategory(): Observable<any> {
		const url = 'api/Product/GetProductCountByCategory';
		return this.httpHelper.postHelper(url);
	}

	getAllProductByCategoryID(obj: any): Observable<any> {
		const url = 'api/Product/GetAllProductByCategoryID';
		return this.httpHelper.postHelper(url, obj);
	}

	getInitialDataForSaveProduct(): Observable<any> {
		const url = 'api/Product/GetInitialDataForSaveProduct';
		return this.httpHelper.postHelper(url);
	}

	getProductBySlug(obj: any): Observable<any> {
		const url = 'api/Product/GetProductBySlug';
		return this.httpHelper.postHelper(url, obj);
	}

	saveProduct(obj: any): Observable<any> {
		const url = 'api/Product/SaveProduct';
		return this.httpHelper.postHelper(url, obj);
	}

	changeProductStatus(obj: any): Observable<any> {
		const url = 'api/Product/ChangeProductStatus';
		return this.httpHelper.postHelper(url, obj);
	}

	deleteProduct(obj: any): Observable<any> {
		const url = 'api/Product/DeleteProduct';
		return this.httpHelper.postHelper(url, obj);
	}

	searchProduct(obj: any): Observable<any> {
		const url = 'api/Product/SearchProduct';
		return this.httpHelper.postHelper(url, obj);
	}
}
