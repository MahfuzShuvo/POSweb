import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { SystemUser } from './../../../models/systemUser';
import { SystemUserService } from './../../../services/systemUser.service';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';
import { Subject, takeUntil } from 'rxjs';
import { SystemUserFormComponent } from 'src/app/components/systemUser-form/systemUser-form.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-system-user',
	templateUrl: './system-user.component.html',
	styleUrls: ['./system-user.component.css']
})
export class SystemUserComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('systemUserForm', { read: ViewContainerRef }) systemUserForm: ViewContainerRef;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstSystemUser: SystemUser[] = [];
	lstAllSystemUser: SystemUser[] = [];
	objSystemUser: SystemUser = new SystemUser();
	totalCount: number = 0;
	modalRef?: BsModalRef;

	constructor(
		private headerService: HeaderService,
		private systemUserService: SystemUserService,
		private messageHelper: MessageHelper,
		private modalService: BsModalService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('System User'));
		this.getAllSystemUser();
	}

	createUser(data: any) {
		// Clear the container
		this.systemUserForm.clear();
		// Create component.
		const systemUserRef = this.systemUserForm.createComponent(SystemUserFormComponent);
		if (data!.SystemUserID > 0) {
			systemUserRef.instance.headerText = 'Edit System User';
			systemUserRef.instance.buttonText = 'Update';
			systemUserRef.instance.objSystemUser = JSON.parse(JSON.stringify(data));
		} else {
			systemUserRef.instance.headerText = 'Add System User';
			systemUserRef.instance.buttonText = 'Save';
		}
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
				this.lstAllSystemUser.splice(index, 1, data);
			} else {
				this.lstSystemUser.push(data)
				this.lstAllSystemUser.push(data)
			}
		})
	}

	getAllSystemUser() {
		this.systemUserService.getAllSystemUser()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstSystemUser = response.ResponseObj;
					this.lstAllSystemUser = JSON.parse(JSON.stringify(this.lstSystemUser));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	getAddress(city: string, state: string, zip: string) {
		return [city, state, zip].join(", ");
	}

	deleteUser(systemUser: SystemUser) {
		this.objSystemUser = new SystemUser();
		this.objSystemUser = JSON.parse(JSON.stringify(systemUser));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objSystemUser.SystemUserID > 0) {
			this.systemUserService.deleteSystemUser(this.objSystemUser.SystemUserID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstSystemUser.findIndex(x => x.SystemUserID == this.objSystemUser.SystemUserID);
						if (index > -1) {
							this.lstSystemUser.splice(index, 1);
							this.lstAllSystemUser.splice(index, 1);
							this.objSystemUser = new SystemUser();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	searchSystemUser(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstSystemUser = JSON.parse(JSON.stringify(this.lstAllSystemUser));
		} else {
			this.lstSystemUser = this.lstAllSystemUser.filter(x =>
				x.FullName.replace(/\s/g, '').toLowerCase().includes(str)
				|| x.Username.replace(/\s/g, '').toLowerCase().includes(str)
				|| x.PhoneNumber.replace(/\s/g, '').toLowerCase().includes(str)
				|| x.Email.replace(/\s/g, '').toLowerCase().includes(str)
			);
		}
		this.totalCount = this.lstSystemUser.length;
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
