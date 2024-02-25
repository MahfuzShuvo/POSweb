import { BranchService } from 'src/app/services/branch.service';
import { HeaderService } from './../../common/service/header.service';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { Branch } from 'src/app/models/branch';
import { LocalstoreService } from 'src/app/common/service/localstore.service';
import { DataService } from 'src/app/common/service/data.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	title: string = '';
	lstBranch: Branch[] = [];
	lstAllBranch: Branch[] = [];
	selectedBranch: Branch = new Branch();
	timer: any;
	loggedInUser: any;

	constructor(
		private headerService: HeaderService,
		private branchService: BranchService,
		private localStoreService: LocalstoreService,
		public dataService: DataService
	) { }

	ngOnInit() {
		this.selectedBranch = this.localStoreService.getData('Branch');
		this.loggedInUser = this.localStoreService.getData('User');
		this.headerService.title.subscribe(title => this.title = title);

		// this.getAllBranch();
	}

	getAllBranchByUser() {
		this.branchService.getAllBranchByUserID()
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstBranch = response.ResponseObj;
					this.lstAllBranch = response.ResponseObj;
				}
			})

	}

	selectBranch(branch: Branch) {
		this.selectedBranch = this.lstBranch.filter(x => x.BranchID == branch.BranchID)[0];
	}

	searchDropdwon(event: any) {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			var str = event.target.value;
			if (str != '') {
				this.lstBranch = this.lstAllBranch.filter(x => x.BranchName!.toLowerCase().includes(str.toLowerCase()));
			} else {
				this.lstBranch = JSON.parse(JSON.stringify(this.lstAllBranch));
			}
		}, 200);
	}

	selectItem(branch: Branch) {
		if (branch) {
			this.selectedBranch = JSON.parse(JSON.stringify(branch));
			this.localStoreService.setData('Branch', branch);
			this.dataService.selectedBranch.next(branch);
		}
	}
}
