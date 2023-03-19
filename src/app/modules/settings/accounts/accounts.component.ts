import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { Account } from 'src/app/models/account';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMGetAccountBalanceExpense } from 'src/app/models/VM/vmGetAccountBalanceExpense';
import { AccountService } from 'src/app/services/account.service';

@Component({
	selector: 'app-accounts',
	templateUrl: './accounts.component.html',
	styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('accountFormModal', { read: TemplateRef }) accountFormModal: TemplateRef<any>;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	@ViewChild('balanceModal', { read: TemplateRef }) balanceModal: TemplateRef<any>;
	lstAccount: VMGetAccountBalanceExpense[] = [];
	lstAllAccount: VMGetAccountBalanceExpense[] = [];
	objAccount: Account = new Account();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	buttonText: string;
	modalTitle: string;

	constructor(
		private headerService: HeaderService,
		private accountService: AccountService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private modalService: BsModalService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('Accounts'));
		this.getAllAccount();
	}

	toggleStatus(event: any) {
		this.objAccount.Status = (event.target.checked) ? 1 : 2;
	}

	getAllAccount() {
		this.accountService.getAllAccount()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstAccount = response.ResponseObj;
					this.lstAllAccount = JSON.parse(JSON.stringify(this.lstAccount));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchAccount(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstAccount = JSON.parse(JSON.stringify(this.lstAllAccount));
		} else {
			this.lstAccount = this.lstAllAccount.filter(x => x.AccountTitle.replace(/\s/g, '').toLowerCase().includes(str)
				|| x.AccountNumber.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstAccount.length;
	}

	createAccount() {
		this.modalTitle = 'Add';
		this.buttonText = 'Save';

		this.objAccount = new Account();
		this.modalRef = this.modalService.show(this.accountFormModal);
	}

	editAccount(account: Account) {
		this.modalTitle = 'Edit';
		this.buttonText = 'Update';

		this.objAccount = new Account();
		this.objAccount = JSON.parse(JSON.stringify(account));
		this.modalRef = this.modalService.show(this.accountFormModal);
	}

	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	emptyCheck(event: any) {
		if (event.target.value == '') {
			this.objAccount.Balance = 0;
		}
	}

	saveAccount() {
		this.dataService.isFormSubmitting.next(true);
		this.accountService.saveAccount(this.objAccount)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstAccount.findIndex(x => x.AccountID == response.ResponseObj.AccountID);
					if (index > -1) {
						this.lstAccount.splice(index, 1, response.ResponseObj);
						this.lstAllAccount.splice(index, 1, response.ResponseObj);
					} else {
						this.lstAccount.push(response.ResponseObj);
						this.lstAllAccount.push(response.ResponseObj);
					}

					this.objAccount = new Account();
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	deleteAccount(account: Account) {
		this.objAccount = new Account();
		this.objAccount = JSON.parse(JSON.stringify(account));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objAccount.AccountID > 0) {
			this.accountService.deleteAccount(this.objAccount.AccountID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstAccount.findIndex(x => x.AccountID == this.objAccount.AccountID);
						if (index > -1) {
							this.lstAccount.splice(index, 1);
							this.lstAllAccount.splice(index, 1);
							this.objAccount = new Account();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	balanceModalOpen(account: Account) {
		this.objAccount = new Account();
		this.objAccount = JSON.parse(JSON.stringify(account));

		this.modalRef = this.modalService.show(this.balanceModal,);

	}

	balanceEntry(balance: any) {
		if (balance > 0) {
			this.objAccount.Balance = balance;
		}
	}

	addBalance() {
		if (this.objAccount.Balance > 0) {
			this.dataService.isFormSubmitting.next(true);
			this.accountService.addBalance(this.objAccount)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {

						this.objAccount = new Account();
						this.modalRef?.hide();
						this.getAllAccount();
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
