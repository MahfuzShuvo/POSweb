import { Injectable } from '@angular/core';
import { IconList } from '../common/constants/iconList';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConstant } from '../common/constants/appConstant';

@Injectable({
	providedIn: 'root'
})
export class IconService {

	iconString = IconList.ICON;

	constructor(
		private http: HttpClient
	) { }

	getIcons(): string[] {
		var lst: string[] = [];
		var ico = this.iconString ? this.iconString.split(',').filter(x => x) : [];

		ico.forEach(element => {
			element = element.replace("\n", "");
			element = element.trim();
			lst.push(element);
		});

		return lst;
	}

	getMaterialIcons(): Observable<string> {
		return this.http.get(AppConstant.ICON_URL, { responseType: 'text' });
	}
}
