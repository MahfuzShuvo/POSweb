import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	isFormSubmitting: BehaviorSubject<any> = new BehaviorSubject(null);
	data: any = {};
	subscription!: Subscription;

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

}
