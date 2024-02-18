import { Account } from 'src/app/models/account';
import { AccountService } from './../../services/account.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { Expense } from 'src/app/models/expense';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
	selector: 'app-expense',
	templateUrl: './expense.component.html',
	styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('expenseFormModal', { read: TemplateRef }) expenseFormModal: TemplateRef<any>;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstExpense: Expense[] = [];
	lstAllExpense: Expense[] = [];
	objExpense: Expense = new Expense();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	buttonText: string;
	modalTitle: string;
	lstAccount: Account[] = [];
	selectedAccount: Account = new Account();

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private expenseService: ExpenseService,
		private accountService: AccountService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private modalService: BsModalService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllExpense();
		this.getAllAccount();
	}

	toggleStatus(event: any) {
		this.objExpense.Status = (event.target.checked) ? 1 : 2;
	}

	getAllAccount() {
		this.accountService.getAllAccount()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstAccount = response.ResponseObj;
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	getAllExpense() {
		this.expenseService.getAllExpense()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstExpense = response.ResponseObj;
					this.lstAllExpense = JSON.parse(JSON.stringify(this.lstExpense));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchExpense(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstExpense = JSON.parse(JSON.stringify(this.lstAllExpense));
		} else {
			this.lstExpense = this.lstAllExpense.filter(x => x.ExpenseTitle.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstExpense.length;
	}

	createExpense() {
		this.modalTitle = 'Add';
		this.buttonText = 'Save';

		this.objExpense = new Expense();
		this.modalRef = this.modalService.show(this.expenseFormModal);
	}

	editExpense(brand: Expense) {
		this.modalTitle = 'Edit';
		this.buttonText = 'Update';

		this.objExpense = new Expense();
		this.objExpense = JSON.parse(JSON.stringify(brand));
		this.modalRef = this.modalService.show(this.expenseFormModal);
	}

	saveExpense() {

		if (this.objExpense.AccountID == 0 || !this.objExpense.AccountID) {
			this.messageHelper.showMessage(ResponseStatus.warning, 'Account must be required');
			return;
		}
		this.dataService.isFormSubmitting.next(true);

		this.expenseService.saveExpense(this.objExpense)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstExpense.findIndex(x => x.ExpenseID == response.ResponseObj.ExpenseID);
					if (index > -1) {
						this.lstExpense.splice(index, 1, response.ResponseObj);
						this.lstAllExpense.splice(index, 1, response.ResponseObj);
					} else {
						this.lstExpense.push(response.ResponseObj);
						this.lstAllExpense.push(response.ResponseObj);
					}

					this.objExpense = new Expense();
					this.selectedAccount = new Account();
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	getAccountName(accountID: number) {
		var exist = this.lstAccount.filter(x => x.AccountID == accountID)[0];
		if (exist) {
			return exist.AccountTitle;
		}
		return '-';
	}

	deleteExpense(brand: Expense) {
		this.objExpense = new Expense();
		this.objExpense = JSON.parse(JSON.stringify(brand));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objExpense.ExpenseID > 0) {
			this.expenseService.deleteExpense(this.objExpense.ExpenseID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstExpense.findIndex(x => x.ExpenseID == this.objExpense.ExpenseID);
						if (index > -1) {
							this.lstExpense.splice(index, 1);
							this.lstAllExpense.splice(index, 1);
							this.objExpense = new Expense();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	selectAccount(account: Account) {
		if (account) {
			this.selectedAccount = this.lstAccount.filter(x => x.AccountID == account.AccountID)[0];
			this.objExpense.AccountID = account.AccountID;
		} else {
			this.objExpense.AccountID = 0;
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}

}
