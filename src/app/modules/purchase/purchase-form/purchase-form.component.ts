import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMProduct } from 'src/app/models/VM/vmProduct';
import { Purchase } from 'src/app/models/purchase';
import { Supplier } from 'src/app/models/supplier';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
	selector: 'app-purchase-form',
	templateUrl: './purchase-form.component.html',
	styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('searchSupplier') searchSupplier: ElementRef;
	purchaseCode: string = '';
	objPurchase: Purchase = new Purchase();
	lstSupplier: Supplier[] = [];
	lstAllSupplier: Supplier[] = [];
	selectedSupplier: Supplier = new Supplier();
	maxDate: Date;
	lstProduct: VMProduct[] = [];
	timeout: any = null;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private messageHelper: MessageHelper,
		private productService: ProductService,
		private supplierService: SupplierService,
		public dataService: DataService,
		private router: Router
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		var childRoute = "";
		this.activatedRoute.url.subscribe((params: Params) => {
			childRoute = params[0].path;
		})

		this.activatedRoute.params.subscribe((params: Params) => {
			this.purchaseCode = (!params['slug']) ? '' : params['slug'];
			if (this.purchaseCode != '') {
				setTimeout(() => {

					this.getPurchaseByCode(this.purchaseCode);
				}, 500);
			}
		});
		Promise.resolve().then(() => this.headerService.setTitle(childRoute!.toString() + ' ' + headerTitle!.toString()));
	}

	ngOnInit() {
		// this.getAllSupplier();
		this.maxDate = new Date();
	}

	getPurchaseByCode(purchaseCode: string) {

	}

	onKeyProductSearch(event: any) {
		var value = event.target.value;

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			if (value != '') {
				if (event.keyCode != 13) {
					this.searchProduct(value);
				}
			} else {
				this.lstProduct = [];
			}
		}, 500);
	}

	searchProduct(value: string) {
		this.productService.searchProduct(value)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstProduct = response.ResponseObj;
				}
			})
	}

	getAllSupplier() {
		this.supplierService.getAllSupplier()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstSupplier = response.ResponseObj;
					this.lstSupplier = this.lstSupplier.filter(x => x.Status == 1);
					this.lstAllSupplier = JSON.parse(JSON.stringify(this.lstSupplier));
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	selectSupplier(supplier: Supplier) {
		if (supplier) {
			this.selectedSupplier = JSON.parse(JSON.stringify(supplier));
			this.objPurchase.SupplierID = supplier.SupplierID;
		}
	}

	searchSupplierDropdown(str: string) {
		if (str == '') {
			this.lstSupplier = JSON.parse(JSON.stringify(this.lstAllSupplier));
		} else {
			this.lstSupplier = this.lstAllSupplier.filter(x => x.SupplierName.toLowerCase().includes(str.toLowerCase()))
		}

	}

	openSupplierDrop() {
		// this.lstSupplier = JSON.parse(JSON.stringify(this.lstAllSupplier));
		setTimeout(() => {
			this.searchSupplier!.nativeElement.value = '';
			this.searchSupplier!.nativeElement.focus();
		}, 5);
	}

	savePurchase() {

	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
