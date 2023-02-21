import { VMLogin } from './../../models/VM/vmLogin';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { LocalstoreService } from 'src/app/common/service/localstore.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { ResponseStatus } from 'src/app/common/enums/appEnums';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	isPasswordShow: boolean = false;
	objVmLogin: VMLogin = new VMLogin();

	constructor(
		private securityService: SecurityService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private localstoreService: LocalstoreService,
		private router: Router
	) { }

	ngOnInit() {
	}

	login() {
		this.dataService.isFormSubmitting.next(true);
		this.securityService.login(this.objVmLogin)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {

					this.localstoreService.setData('Token', response.ResponseObj.Token);
					this.localstoreService.setData('User', response.ResponseObj);

					this.router.navigateByUrl('dashboard');
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
