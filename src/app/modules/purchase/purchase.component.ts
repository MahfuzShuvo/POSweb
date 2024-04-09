import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { LocalstoreService } from 'src/app/common/service/localstore.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMPurchase } from 'src/app/models/VM/vmPurchase';
import { Branch } from 'src/app/models/branch';
import { Purchase } from 'src/app/models/purchase';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
	selector: 'app-purchase',
	templateUrl: './purchase.component.html',
	styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstPurchase: VMPurchase[] = [];
	lstAllPurchase: VMPurchase[] = [];
	objPurchase: VMPurchase = new VMPurchase();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	selectedBranch: Branch = new Branch();
	isExporting: boolean = false;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private messageHelper: MessageHelper,
		private modalService: BsModalService,
		private purchaseService: PurchaseService,
		private localStoreService: LocalstoreService,
		public dataService: DataService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.selectedBranch = this.localStoreService.getData('Branch');
		this.dataService.selectedBranch.pipe(takeUntil(this.destroy)).subscribe((data: Branch) => {
			if (data && data.BranchID > 0) {
				this.selectedBranch = data;
				this.getAllPurchase();
			}
		})
		this.getAllPurchase();
	}

	getAllPurchase() {
		this.purchaseService.getAllPurchase(this.selectedBranch.BranchID)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstPurchase = response.ResponseObj;
					this.lstAllPurchase = JSON.parse(JSON.stringify(this.lstPurchase));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchPurchase(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstPurchase = JSON.parse(JSON.stringify(this.lstAllPurchase));
		} else {
			this.lstPurchase = this.lstAllPurchase.filter(x => x.PurchaseCode.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstPurchase.length;
	}

	deletePurchase(purchase: VMPurchase) {
		this.objPurchase = new VMPurchase();
		this.objPurchase = JSON.parse(JSON.stringify(purchase));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objPurchase.PurchaseCode != '') {

			this.purchaseService.deletePurchase(this.objPurchase)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstPurchase.findIndex(x => x.PurchaseCode == this.objPurchase.PurchaseCode);
						if (index > -1) {
							this.lstPurchase.splice(index, 1);
							this.lstAllPurchase.splice(index, 1);
							this.objPurchase = new VMPurchase();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	addPurchase() {
		this.router.navigate(['purchase/add']);
	}

	editPurchase(purchaseCode: string) {
		this.router.navigate(['purchase/edit', purchaseCode])
	}

	viewPurchase(purchaseCode: string) {
		this.router.navigate(['purchase/view', purchaseCode])
	}

	exportPurchase() {
		this.isExporting = true;

		var payload = {
			branchID: this.selectedBranch.BranchID,
			startDate: null,
			endDate: null
		}

		this.purchaseService.getPurchaseForExport(payload)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					if (response.ResponseObj) {
						var purchase = new VMPurchase();
						purchase = JSON.parse(JSON.stringify(response.ResponseObj));

						this.exportCSV(purchase);
					} else {
						this.messageHelper.showMessage(ResponseStatus.warning, "No data found to export");
					}
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
					this.isExporting = false;
				}
			})
	}

	exportCSV(data: any) {

		const replacer = (key: any, value: any) => (value === null
			? ''
			: this.isDate(value)
				? moment(value).format("DD/MM/YYYY, hh:mm a")
				: value); 		// specify how you want to handle null values here
		const header = Object.keys(data[0]);

		if (header.length > 0) {
			this.removeCSVItem(header, 'lstProduct');
			this.removeCSVItem(header, 'objCustomer');
			this.removeCSVItem(header, 'BranchID');
			this.removeCSVItem(header, 'objSupplier');
		}

		const csv = data.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));

		csv.unshift(header.join(','));
		const csvArray = csv.join('\r\n');

		const a = document.createElement('a');
		const blob = new Blob([csvArray], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);

		a.href = url;
		a.download = `purchase_report_${moment().format('DD_MM_YYYY_hh_mm_a')}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();
		this.isExporting = false;
	}

	removeCSVItem(arr: any[], value: any) {
		const index = arr.indexOf(value);

		if (index > -1) {
			arr.splice(index, 1);
		}

		return arr;
	}

	isDate(value: any): boolean {
		// Check if the value is null, undefined, or not a string
		if (!value || typeof value !== 'string') {
			return false;
		}

		// Attempt to create a Date object from the value
		const parsedDate = new Date(value);

		// Check if the parsed date is a valid date and not NaN
		if (isNaN(parsedDate.getTime())) {
			// If the parsed date is invalid, attempt to parse using Date.parse
			const parsedTimestamp = Date.parse(value);

			// If Date.parse returns a valid timestamp, it's a valid date
			if (!isNaN(parsedTimestamp)) {
				return true;
			} else {
				return false;
			}
		}

		// If the parsed date is valid, return true
		return true;
	}


	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
