import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { LocalstoreService } from 'src/app/common/service/localstore.service';
import { VMSales } from 'src/app/models/VM/vmSales';
import { Branch } from 'src/app/models/branch';
import { SalesService } from 'src/app/services/sales.service';

@Component({
	selector: 'app-sales-view',
	templateUrl: './sales-view.component.html',
	styleUrls: ['./sales-view.component.css']
})
export class SalesViewComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	objSales: VMSales = new VMSales();
	salesCode: string = '';
	discountInput: number = 0;
	selectedBranch: Branch = new Branch();

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private messageHelper: MessageHelper,
		private salesService: SalesService,
		private localStoreService: LocalstoreService,
		public dataService: DataService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		var childRoute = "";
		this.activatedRoute.url.subscribe((params: Params) => {
			childRoute = params[0].path;
		})

		this.activatedRoute.params.subscribe((params: Params) => {
			this.salesCode = (!params['salesCode']) ? '' : params['salesCode'];
			if (this.salesCode != '') {
				setTimeout(() => {

					this.getSalesByCodeForView(this.salesCode);
				}, 500);
			}
		});
		Promise.resolve().then(() => this.headerService.setTitle(childRoute!.toString() + ' ' + headerTitle!.toString()));
	}

	ngOnInit() {
		this.selectedBranch = this.localStoreService.getData('Branch');
		this.dataService.selectedBranch.pipe(takeUntil(this.destroy)).subscribe((data: Branch) => {
			if (data && data.BranchID > 0) {
				this.selectedBranch = data;
				if (this.salesCode != '') {
					this.objSales = new VMSales()
					this.getSalesByCodeForView(this.salesCode);
				}
			}
		})
	}

	getSalesByCodeForView(salesCode: string) {
		var payload = {
			salesCode,
			branchID: this.selectedBranch.BranchID
		}
		this.salesService.getSalesBySalesCodeForView(payload)
			.pipe(takeUntil(this.destroy))
			.subscribe(response => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.objSales = JSON.parse(JSON.stringify(response.ResponseObj));

					// if (this.objSales.Discount > 0) {
					// 	if (this.objSales.DiscountType == 1) {
					// 		this.discountInput = (parseFloat(this.objSales.Discount.toString()) * 100) / parseFloat(this.objSales.SubTotal.toString());
					// 	} else {
					// 		this.discountInput =this.objSales.Discount;
					// 	}
					// }

					this.objSales.SalesDate = new Date(this.objSales.SalesDate).toLocaleString();

					// this.changeQty();
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
					this.objSales = new VMSales();
				}
			})
	}

	calculateTotalQty() {
		return this.objSales.lstProduct.map(p => p.Qty).reduce((a, b) => a + b);
	}

	calculateTotalPrice() {
		return this.objSales.lstProduct.map(p => (p.Qty * p.FinalPrice)).reduce((a, b) => a + b);
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
