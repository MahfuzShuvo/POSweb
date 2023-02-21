import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { SystemUser } from './../../../models/systemUser';
import { SystemUserService } from './../../../services/systemUser.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-system-user',
	templateUrl: './system-user.component.html',
	styleUrls: ['./system-user.component.css']
})
export class SystemUserComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
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

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
