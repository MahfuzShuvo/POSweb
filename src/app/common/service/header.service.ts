import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderService {
	public title = new BehaviorSubject('');
	public subTitle = new BehaviorSubject('');

	constructor(
		private http: HttpClient
	) { }

	setTitle(title: string) {
		this.title.next(title);
	}

	setSubTitle(subTitle: string) {
		this.subTitle.next(subTitle);
	}
}