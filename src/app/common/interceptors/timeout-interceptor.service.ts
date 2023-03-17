import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable({ providedIn: 'root' })
export class TimeoutInterceptor implements HttpInterceptor {
	constructor(
		@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number
	) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let defaultvalue = req.headers.get('timeout');
		let defaultTimeoutvalue = 0;
		if (defaultvalue == null) {
			defaultTimeoutvalue = Number(60000);
		}
		const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
		const timeoutValueNumeric = Number(timeoutValue);
		return next.handle(req).pipe(timeout(timeoutValueNumeric));
	}
}