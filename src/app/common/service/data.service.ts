import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Branch } from 'src/app/models/branch';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	isFormSubmitting: BehaviorSubject<any> = new BehaviorSubject(null);
	isSidebarToggle: BehaviorSubject<any> = new BehaviorSubject(null);
	data: any = {};
	subscription!: Subscription;
	selectedBranch: BehaviorSubject<Branch> = new BehaviorSubject(new Branch());

	constructor() { }

	setData(option: string, value: any): void {
		this.data[option] = value;
	}

	getData(option: string) {
		return this.data[option];
	}

	removeData(): void {
		this.data = {};
	}

	getENUM(ENUM: any) {
		let myEnum = [];
		let objectEnum = Object.keys(ENUM);
		const values = objectEnum.slice(0, objectEnum.length / 2);
		const keys = objectEnum.slice(objectEnum.length / 2);

		for (let i = 0; i < objectEnum.length / 2; i++) {
			myEnum.push({ key: keys[i], value: values[i] });
		}
		return myEnum;
	}

	getSpecific(start: number, end: number, item: any[]) {
		return item?.slice(start, end);
	}
}
