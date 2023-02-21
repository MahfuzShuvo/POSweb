import { LocalstoreService } from './../../common/service/localstore.service';
import { DataService } from './../../common/service/data.service';
import { MessageHelper } from './../../common/helper/messageHelper';
import { ResponseStatus } from './../../common/enums/appEnums';
import { SecurityService } from './../../services/security.service';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { VMRegister } from 'src/app/models/VM/vmRegister';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMLogin } from 'src/app/models/VM/vmLogin';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	isPasswordShow: boolean = false;
	objVmRegister: VMRegister = new VMRegister();
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

	register() {
		this.dataService.isFormSubmitting.next(true);
		this.securityService.register(this.objVmRegister)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.login();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	login() {
		this.objVmLogin = new VMLogin();
		this.objVmLogin.Username = this.objVmRegister.Username;
		this.objVmLogin.Password = this.objVmRegister.Password;

		this.securityService.login(this.objVmLogin)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.messageHelper.showMessage(response.ResponseCode, 'You are redirected to logged in');

					this.localstoreService.setData('Token', response.ResponseObj.Token);
					this.localstoreService.setData('User', response.ResponseObj);

					this.objVmRegister = new VMRegister();
					this.objVmLogin = new VMLogin();
					this.router.navigateByUrl('dashboard');
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			});
	}

	//Phone number formatting 
	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
