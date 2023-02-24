import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { SystemUser } from './../../../models/systemUser';
import { SystemUserService } from './../../../services/systemUser.service';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';
import { Subject, takeUntil } from 'rxjs';
import { SystemUserFormComponent } from 'src/app/components/systemUser-form/systemUser-form.component';

@Component({
	selector: 'app-system-user',
	templateUrl: './system-user.component.html',
	styleUrls: ['./system-user.component.css']
})
export class SystemUserComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('systemUserForm', { read: ViewContainerRef }) systemUserForm: ViewContainerRef;
	lstSystemUser: SystemUser[] = [];
	totalCount: number = 0;

	constructor(
		private headerService: HeaderService,
		private systemUserService: SystemUserService,
		private messageHelper: MessageHelper
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('System User'));
		this.getAllSystemUser();
	}

	createUser() {
		// Clear the container
		this.systemUserForm.clear();
		// Create component.
		const systemUserRef = this.systemUserForm.createComponent(SystemUserFormComponent);
		systemUserRef.instance.headerText = 'Add System User';
		systemUserRef.instance.buttonText = 'Save';
		// destroy component
		let isShowInstance = systemUserRef.instance.isShow;
		if (isShowInstance) {
			isShowInstance.emit(true);
			isShowInstance.subscribe((isShow: boolean) => {
				if (!isShow) {
					systemUserRef.destroy();
					this.systemUserForm.clear();
				}
			});
		}

		systemUserRef.instance.newSystemUser.subscribe((data: SystemUser) => {
			var index = this.lstSystemUser.findIndex(x => x.SystemUserID == data.SystemUserID);
			if (index > -1) {
				this.lstSystemUser.splice(index, 1, data);
			} else {
				this.lstSystemUser.push(data)
			}
		})
	}

	getAllSystemUser() {
		this.systemUserService.getAllSystemUser()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstSystemUser = response.ResponseObj;
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	getAddress(city: string, state: string, zip: string) {
		return [city, state, zip].join(", ");
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
