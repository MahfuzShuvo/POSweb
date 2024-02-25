import { Router } from '@angular/router';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { MessageHelper } from './../../common/helper/messageHelper';
import { SecurityService } from './../../services/security.service';
import { SystemUser } from './../../models/systemUser';
import { LocalstoreService } from './../../common/service/localstore.service';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { DataService } from 'src/app/common/service/data.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	objSystemUser: SystemUser = new SystemUser();
	profileImhText: string = '';
	isSidebarToggle: boolean = false;

	constructor(
		private localStoreService: LocalstoreService,
		private securityService: SecurityService,
		private messageHelper: MessageHelper,
		private router: Router,
		public dataService: DataService
	) { }

	ngOnInit() {
		if (this.localStoreService.getData('Token') != null) {
			if (this.localStoreService.getData('User')) {
				this.objSystemUser = this.localStoreService.getData('User');
				var matches = this.objSystemUser ? this.objSystemUser!.FullName!.match(/\b(\w)/g) : '';

				this.profileImhText = matches![0] + matches![1];
			}
		}
	}

	logout() {
		this.securityService.logout()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.localStoreService.removeAll();
					this.router.navigateByUrl('/login');
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	clickToToggleSidebar() {
		this.isSidebarToggle = !this.isSidebarToggle;

		this.dataService.isSidebarToggle.next(this.isSidebarToggle)
	}

	clickToGoDashboard() {
		this.router.navigateByUrl('/dashboard');
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}

}
