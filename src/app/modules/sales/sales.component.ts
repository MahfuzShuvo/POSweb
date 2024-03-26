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
import { VMSales } from 'src/app/models/VM/vmSales';
import { Branch } from 'src/app/models/branch';
import { SalesService } from 'src/app/services/sales.service';


@Component({
	selector: 'app-sales',
	templateUrl: './sales.component.html',
	styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstSales: VMSales[] = [];
	lstAllSales: VMSales[] = [];
	objSales: VMSales = new VMSales();
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
		private salesService: SalesService,
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
				this.getAllSales();
			}
		})
		this.getAllSales();
	}

	getAllSales() {
		this.salesService.getAllSales(this.selectedBranch.BranchID)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstSales = response.ResponseObj;
					this.lstAllSales = JSON.parse(JSON.stringify(this.lstSales));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchSales(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstSales = JSON.parse(JSON.stringify(this.lstAllSales));
		} else {
			this.lstSales = this.lstAllSales.filter(x => x.SalesCode.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstSales.length;
	}

	deleteSales(sales: VMSales) {
		this.objSales = new VMSales();
		this.objSales = JSON.parse(JSON.stringify(sales));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objSales.SalesCode != '') {

			this.salesService.deleteSales(this.objSales)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstSales.findIndex(x => x.SalesCode == this.objSales.SalesCode);
						if (index > -1) {
							this.lstSales.splice(index, 1);
							this.lstAllSales.splice(index, 1);
							this.objSales = new VMSales();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	addSales() {
		this.router.navigate(['pos']);
	}

	editSales(salesCode: string) {
		this.router.navigate(['pos/edit', salesCode])
	}

	viewSales(salesCode: string) {
		this.router.navigate(['sales/view', salesCode])
	}
	exportSales() {
		this.isExporting = true;

		var payload = {
			branchID: this.selectedBranch.BranchID,
			startDate: null,
			endDate: null
		}

		this.salesService.getSaleForExport(payload)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					if (response.ResponseObj) {
						var sales = new VMSales();
						sales = JSON.parse(JSON.stringify(response.ResponseObj));

						this.exportCSV(sales);
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
			this.removeItem(header, 'lstProduct');
			this.removeItem(header, 'objCustomer');
			this.removeItem(header, 'BranchID');
			this.removeItem(header, 'Status');
		}

		const csv = data.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));

		csv.unshift(header.join(','));
		const csvArray = csv.join('\r\n');

		const a = document.createElement('a');
		const blob = new Blob([csvArray], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);

		a.href = url;
		a.download = `sales_report_${moment().format('DD_MM_YYYY_hh_mm_a')}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();
		this.isExporting = false;
	}

	removeItem(arr: any[], value: any) {
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
