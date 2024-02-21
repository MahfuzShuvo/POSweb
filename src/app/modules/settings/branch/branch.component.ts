import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { RecordStatus, ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { Branch } from 'src/app/models/branch';
import { SystemUser } from 'src/app/models/systemUser';
import { BranchService } from 'src/app/services/branch.service';
import { SystemUserService } from 'src/app/services/systemUser.service';

@Component({
	selector: 'app-branch',
	templateUrl: './branch.component.html',
	styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('branchFormModal', { read: TemplateRef }) branchFormModal: TemplateRef<any>;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstBranch: Branch[] = [];
	lstAllBranch: Branch[] = [];
	objBranch: Branch = new Branch();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	buttonText: string;
	modalTitle: string;
	lstManager: SystemUser[] = [];
	selectedBranchManager: SystemUser = new SystemUser();

	constructor(
		private headerService: HeaderService,
		private branchService: BranchService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private modalService: BsModalService,
		private systemUserService: SystemUserService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('Branch'));
		this.getAllSystemUser();
		this.getAllBranch();
	}

	toggleStatus(event: any) {
		this.objBranch.Status = (event.target.checked) ? 1 : 2;
	}

	getAllSystemUser() {
		this.systemUserService.getAllSystemUser()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstManager = response.ResponseObj;

				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	selectBranchManager(manager: SystemUser) {
		if (manager) {
			this.selectedBranchManager = this.lstManager.filter(x => x.SystemUserID == manager.SystemUserID)[0];
			this.objBranch.BranchManagerID = manager.SystemUserID;
		} else {
			this.objBranch.BranchManagerID = 0;
		}
	}

	getAllBranch() {
		this.branchService.getAllBranch()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstBranch = response.ResponseObj;
					this.lstAllBranch = JSON.parse(JSON.stringify(this.lstBranch));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchBranch(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstBranch = JSON.parse(JSON.stringify(this.lstAllBranch));
		} else {
			this.lstBranch = this.lstAllBranch.filter(x => x.BranchName.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstBranch.length;
	}

	createBranch() {
		this.modalTitle = 'Add';
		this.buttonText = 'Save';

		this.objBranch = new Branch();
		this.modalRef = this.modalService.show(this.branchFormModal);
	}

	editBranch(branch: Branch) {
		this.modalTitle = 'Edit';
		this.buttonText = 'Update';

		this.objBranch = new Branch();
		this.objBranch = JSON.parse(JSON.stringify(branch));
		if (this.objBranch.BranchManagerID > 0) {
			this.selectedBranchManager = this.lstManager.filter(x => x.SystemUserID == this.objBranch.BranchManagerID)[0];
		}
		this.modalRef = this.modalService.show(this.branchFormModal);
	}

	saveBranch() {
		this.dataService.isFormSubmitting.next(true);
		this.branchService.saveBranch(this.objBranch)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstBranch.findIndex(x => x.BranchID == response.ResponseObj.BranchID);
					if (index > -1) {
						this.lstBranch.splice(index, 1, response.ResponseObj);
						this.lstAllBranch.splice(index, 1, response.ResponseObj);
					} else {
						this.lstBranch.push(response.ResponseObj);
						this.lstAllBranch.push(response.ResponseObj);
					}

					this.objBranch = new Branch();
					this.selectedBranchManager = new SystemUser();
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	deleteBranch(branch: Branch) {
		this.objBranch = new Branch();
		this.objBranch = JSON.parse(JSON.stringify(branch));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objBranch.BranchID > 0) {
			this.branchService.deleteBranch(this.objBranch.BranchID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstBranch.findIndex(x => x.BranchID == this.objBranch.BranchID);
						if (index > -1) {
							this.lstBranch.splice(index, 1);
							this.lstAllBranch.splice(index, 1);
							this.objBranch = new Branch();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	getManagerName(managerId: number) {
		var result = '-'
		if (managerId > 0) {
			var exist = this.lstManager.filter(x => x.SystemUserID == managerId)[0];
			if (exist) {
				result = exist.FullName;
			}
		}

		return result;
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
