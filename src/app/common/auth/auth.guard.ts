import { AuthGuardService } from './auth.guard.service';
import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalstoreService } from '../service/localstore.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private authGuardService: AuthGuardService,
		private router: Router,
		private localStoreService: LocalstoreService
	) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> {
		return this.authGuardService.isLoggedIn
			.pipe(map((isLoggedIn: boolean) => {
				// if (!isLoggedIn) {
				// 	this.router.navigate(['login']);
				// 	return false;
				// }
				// return true;
				if (!this.localStoreService.getData("Token")) {
					this.localStoreService.removeToken();
					this.localStoreService.removeAll();
					this.router.navigate(['/login']);
					return false;
				} else {
					return true;
				}
			}));
	}
}
