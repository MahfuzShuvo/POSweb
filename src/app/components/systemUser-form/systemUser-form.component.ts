import { MessageHelper } from './../../common/helper/messageHelper';
import { ResponseStatus } from './../../common/enums/appEnums';
import { ResponseMessage } from './../../models/DTO/responseMessage';
import { DataService } from './../../common/service/data.service';
import { SystemUserService } from './../../services/systemUser.service';
import { SystemUser } from './../../models/systemUser';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-systemUser-form',
	templateUrl: './systemUser-form.component.html',
	styleUrls: ['./systemUser-form.component.css']
})
export class SystemUserFormComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@Output() isShow: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() buttonText: string = '';
	@Output() headerText: string = '';
	newSystemUser: Subject<SystemUser> = new Subject<SystemUser>();
	isPasswordShow: boolean = false;
	objSystemUser: SystemUser = new SystemUser();

	constructor(
		private systemUserService: SystemUserService,
		public dataService: DataService,
		private messageHelper: MessageHelper
	) { }

	ngOnInit() {
	}

	closeSidebar() {
		this.objSystemUser = new SystemUser();
		this.isShow.emit(false);
	}

	toggleStatus(event: any) {
		this.objSystemUser.Status = (event.target.checked) ? 1 : 2;
	}

	//Phone number formatting 
	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	saveSystemUser() {
		this.dataService.isFormSubmitting.next(true);
		if (this.objSystemUser) {
			this.systemUserService.saveSystemUser(this.objSystemUser)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						this.newSystemUser.next(response.ResponseObj);

						this.closeSidebar()
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
