import { Injectable } from '@angular/core';
import { UserVM } from 'src/app/models/VM/userVM';

@Injectable({
	providedIn: 'root'
})
export class LocalstoreService {
	private tokenName = 'Token';
	private saveBASEURLKEY = 'app_base_url';
	private baseURL;

	constructor() {
		this.baseURL = localStorage?.getItem(this.saveBASEURLKEY);
	}

	get BASE_URL() {
		return this.baseURL as any;
	}
	set BASE_URL(value: string) {
		localStorage.setItem(this.saveBASEURLKEY, value);
		this.baseURL = value;
	}

	saveAuth(token: UserVM) {
		localStorage.setItem(this.tokenName, JSON.stringify(token));
	}

	getAuthData(): UserVM {
		const tokenData = localStorage.getItem(this.tokenName);
		if (tokenData && tokenData !== undefined && tokenData.length > 30) {
			return JSON.parse(tokenData);;
		}
		return null as any;
	}

	getToken(): string {
		let data = this.getAuthData();
		return data ? data : "" as any;
	}

	removeToken() {
		const data = localStorage.removeItem(this.tokenName);
	}

	setData(keyName: any, data: any) {
		localStorage.setItem(keyName, JSON.stringify(data));
	}

	getData(keyName: any): any {
		const data = localStorage.getItem(keyName);
		if (data && data !== undefined) {
			return JSON.parse(data);
		}
	}

	removeData(keyName: any) {
		localStorage.removeItem(keyName);
	}

	removeAll() {
		localStorage.clear();
	}
}
