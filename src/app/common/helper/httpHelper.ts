import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, timeout } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../spinner/loading-spinner.component';

@Injectable({ providedIn: "root" })
export class HttpHelper {
	static numberOfRequest = 0;
	private timeOutTime = 60000;

	constructor(
		private httpClient: HttpClient,
		// private loadingSpinner: LoadingSpinnerComponent
	) { }

	// public hideLoader() {
	// 	HttpHelper.numberOfRequest = 0;
	// 	this.loadingSpinner.hide();
	// }

	postHelper(url: string, obj: any = {}, currentPage: number = 0, pageSize: number = 20): Observable<any> {
		HttpHelper.numberOfRequest++;
		let payload = {
			RequestObj: obj,
			PageRecordSize: pageSize,
			PageNumber: currentPage,
			UserId: 0
		}

		return this.httpClient.post(url, payload)
			.pipe(timeout(this.timeOutTime))
			.pipe(map((value: any) => value,
				(error: HttpErrorResponse) => {
					this.handleError(error);
				})).pipe(catchError(this.handleError.bind(this)))
			.pipe(finalize(() => {
				HttpHelper.numberOfRequest--;
			}));
	}

	getHelper(url: string): Observable<any> {
		HttpHelper.numberOfRequest++;
		return this.httpClient.get(url)
			.pipe(timeout(this.timeOutTime))
			.pipe(map((value: any) => {
				return value;
			}, (error: HttpErrorResponse) => {
				this.handleError(error);
			})).pipe(catchError(this.handleError.bind(this)))
			.pipe(finalize(() => {
				HttpHelper.numberOfRequest--;
			}));
	}

	handleError(error: any) {
		console.log(error);
		let errMsg = error.message
			? error.message
			: error.status
				? `${error.status} - ${error.statusText}`
				: 'Server error';
		// if (HttpHelper.numberOfRequest == 1) {
		// 	if (error.status == 401) {
		// 		this.messageHelper.showMessage(
		// 			1000,
		// 			'Sorry, Invalid User Name or Password, Please Log in again'
		// 		);
		// 		localStorage.clear();
		// 		this.router.navigate(['/login']);
		// 	} else if (error.message == 'Timeout has occurred') {
		// 		this.messageHelper.showMessage(1000, 'response time out');
		// 	} else {
		// 		this.messageHelper.showMessage(1000, 'error connection');
		// 	}
		// }
		return throwError(() => {
			new Error(error.error);
		});
	}
}
