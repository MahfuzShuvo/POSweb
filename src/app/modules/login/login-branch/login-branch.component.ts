import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { LocalstoreService } from 'src/app/common/service/localstore.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { Branch } from 'src/app/models/branch';
import { SystemUser } from 'src/app/models/systemUser';
import { BranchService } from 'src/app/services/branch.service';

@Component({
	selector: 'app-login-branch',
	templateUrl: './login-branch.component.html',
	styleUrls: ['./login-branch.component.css']
})
export class LoginBranchComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	lstBranch: Branch[] = [];
	user: SystemUser = new SystemUser();

	constructor(
		private branchService: BranchService,
		private messageHelper: MessageHelper,
		private localStoreService: LocalstoreService
	) { }

	ngOnInit() {
		this.user = this.localStoreService.getData('User');
		this.getAllBranch();
	}

	getAllBranch() {
		this.branchService.getAllBranch()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstBranch = response.ResponseObj;
					// this.totalCount = response.TotalCount
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
