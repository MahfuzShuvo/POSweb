import { DataService } from './../service/data.service';
import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalstoreService } from '../service/localstore.service';
import { MessageHelper } from '../helper/messageHelper';

@Injectable({ providedIn: 'root' })
export class HttpClientInterceptor implements HttpInterceptor {

	constructor(
		private router: Router,
		private notifier: MessageHelper,
		private localStoreService: LocalstoreService,
		private dataService: DataService
		//private store: Store<LoaderState>
	) { }

	showHttpErrorOnTrayMessage(message: string) {
		this.notifier.showMessage(404, '');
	}

	private tokenExpired(token: string) {
		const expiry = JSON.parse(atob(token.split(".")[1])).exp;
		return Math.floor(new Date().getTime() / 1000) >= expiry;
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		let authToken = this.localStoreService.getToken();
		const url = environment.BASE_URL + request.url;
		if (authToken != null && authToken != "") {
			authToken = `Bearer ${authToken}`;
		}
		const reqClone = request.clone({
			url, headers: request.headers.set('Authorization', `${authToken}`)
		});

		return next.handle(reqClone).pipe(map((event) => {
			if (event instanceof HttpResponse) {
				const responseData = event.body;
				if (!responseData || !responseData.isSuccess) {
					// const message = responseData.message;
					// if (request.url.indexOf("csv") < 0) {
					//   this.showHttpErrorOnTrayMessage(message);
					// }
				}
			}
			return event;
		}),
			catchError((err: HttpErrorResponse) => {
				if (err.status === 401) {
					this.showHttpErrorOnTrayMessage(err.error.message);
					this.router.navigate(["/login"]);
				} else {
					this.showHttpErrorOnTrayMessage(err.error);
				}

				return throwError(() => err);
			}),
			finalize(() => {
				this.dataService.isFormSubmitting.next(null);
			}));
	}
}
