import { BranchService } from 'src/app/services/branch.service';
import { HeaderService } from './../../common/service/header.service';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { Branch } from 'src/app/models/branch';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	title: string = '';
	lstBranch: Branch[] = [];
	selectedBranch: Branch = new Branch();

	constructor(
		private headerService: HeaderService,
		private branchService: BranchService
	) { }

	ngOnInit() {
		this.headerService.title.subscribe(title => this.title = title);

		// this.getAllBranch();
	}

	getAllBranch() {
		this.branchService.getAllBranch()
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstBranch = response.ResponseObj;
				}
			})

	}

	selectBranch(branch: Branch) {
		this.selectedBranch = this.lstBranch.filter(x => x.BranchID == branch.BranchID)[0];
	}
}
