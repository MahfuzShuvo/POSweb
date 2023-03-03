import { Role } from './../../models/role';
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
	@Output() objSystemUser: SystemUser = new SystemUser();
	@Output() lstRole: Role[] = [];

	constructor(
		private systemUserService: SystemUserService,
		public dataService: DataService,
		private messageHelper: MessageHelper
	) { }

	ngOnInit() {
	}

	getRoleName(roleID: number) {
		var exist = this.lstRole.filter(x => x.RoleID == roleID)[0];
		if (exist) {
			return exist.RoleName;
		}
		return '-';
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

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
