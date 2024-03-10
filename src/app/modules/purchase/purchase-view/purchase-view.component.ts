import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { LocalstoreService } from 'src/app/common/service/localstore.service';
import { VMPurchase } from 'src/app/models/VM/vmPurchase';
import { Branch } from 'src/app/models/branch';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
	selector: 'app-purchase-view',
	templateUrl: './purchase-view.component.html',
	styleUrls: ['./purchase-view.component.css']
})
export class PurchaseViewComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	objPurchase: VMPurchase = new VMPurchase();
	purchaseCode: string = '';
	discountInput: number = 0;
	selectedBranch: Branch = new Branch();

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private messageHelper: MessageHelper,
		private purchaseService: PurchaseService,
		private localStoreService: LocalstoreService,
		public dataService: DataService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		var childRoute = "";
		this.activatedRoute.url.subscribe((params: Params) => {
			childRoute = params[0].path;
		})

		this.activatedRoute.params.subscribe((params: Params) => {
			this.purchaseCode = (!params['purchaseCode']) ? '' : params['purchaseCode'];
			if (this.purchaseCode != '') {
				setTimeout(() => {

					this.getPurchaseByCodeForView(this.purchaseCode);
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

				if (this.purchaseCode != '') {
					this.objPurchase = new VMPurchase();
					this.getPurchaseByCodeForView(this.purchaseCode);
				}
			}
		})
	}

	getPurchaseByCodeForView(purchaseCode: string) {
		var payload = {
			purchaseCode,
			branchID: this.selectedBranch.BranchID
		}
		this.purchaseService.getPurchaseByPurchaseCodeForView(payload)
			.pipe(takeUntil(this.destroy))
			.subscribe(response => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.objPurchase = JSON.parse(JSON.stringify(response.ResponseObj));

					// if (this.objPurchase.Discount > 0) {
					// 	if (this.objPurchase.DiscountType == 1) {
					// 		this.discountInput = (parseFloat(this.objPurchase.Discount.toString()) * 100) / parseFloat(this.objPurchase.SubTotal.toString());
					// 	} else {
					// 		this.discountInput =this.objPurchase.Discount;
					// 	}
					// }

					this.objPurchase.PurchaseDate = new Date(this.objPurchase.PurchaseDate).toLocaleString();

					// this.changeQty();
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	calculateTotalQty() {
		return this.objPurchase.lstProduct.map(p => p.Qty).reduce((a, b) => a + b);
	}

	calculateTotalPrice() {
		return this.objPurchase.lstProduct.map(p => (p.Qty * p.PurchasePrice)).reduce((a, b) => a + b);
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
