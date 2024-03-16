import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { LocalstoreService } from 'src/app/common/service/localstore.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMProduct, VMProductSearch } from 'src/app/models/VM/vmProduct';
import { VMProductBarcode } from 'src/app/models/VM/vmProductBarcode';
import { Branch } from 'src/app/models/branch';
import { ProductService } from 'src/app/services/product.service';

@Component({
	selector: 'app-product-barcode',
	templateUrl: './product-barcode.component.html',
	styleUrls: ['./product-barcode.component.css']
})
export class ProductBarcodeComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('searchProductText') searchProductText: ElementRef;
	rowsNumber: number = 3;
	columnsNumber: number = 3;
	numberOfBarcode: number = 0;
	sku: string = '';
	lstBarcode: any[] = [];
	lstProduct: VMProduct[] = [];
	timeout: any;
	noMatchFound: string = '';
	selectedBranch: Branch = new Branch();
	objBarcode: VMProductBarcode = new VMProductBarcode();

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private localStoreService: LocalstoreService,
		public dataService: DataService,
		private productService: ProductService
	) {
		Promise.resolve().then(() => this.headerService.setTitle('Barcode'));
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.sku = (!params['sku']) ? '' : params['sku'];
			if (this.sku != '') {
				this.searchProduct(this.sku);
			}
		});

		this.selectedBranch = this.localStoreService.getData('Branch');
		this.dataService.selectedBranch.pipe(takeUntil(this.destroy)).subscribe((data: Branch) => {
			if (data && data.BranchID > 0) {
				this.selectedBranch = data;
			}
		})
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
				this.noMatchFound = '';
			}
		}, 500);
	}

	searchProduct(value: string) {
		var searchObj = new VMProductSearch();
		searchObj.BranchID = this.selectedBranch.BranchID;
		searchObj.SearchText = value!.toLowerCase();

		this.productService.searchProduct(searchObj)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstProduct = response.ResponseObj;
					this.lstProduct = this.lstProduct.filter(x => x.Qty > 0)

					if (this.sku && this.sku != '') {
						this.productAddToGenerateBarcode(response.ResponseObj[0]);
					}

					this.noMatchFound = '';
				} else {
					this.noMatchFound = response.Message;
				}
			})
	}

	productAddToGenerateBarcode(product: VMProduct) {
		if (product && product.SKU != '') {
			var existProduct = this.objBarcode.lstProduct.filter(x => x.SKU == product.SKU)[0];
			if (!existProduct) {
				product.BarcodeQty = 1;
				this.objBarcode.lstProduct.push(product);
				this.lstProduct = [];
				this.searchProductText!.nativeElement.value = '';

				// this.changeQty();
			}
		}
	}

	incrementValue(event: Event, product: VMProduct) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector(`input[type="number"]#quantity_${product.SKU}`) as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			// inputElement.stepUp();

			if (product.BarcodeQty < product.Qty) {
				product.BarcodeQty++;
			}
		}
	}
	decrementValue(event: Event, product: VMProduct) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector(`input[type="number"]#quantity_${product.SKU}`) as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			// inputElement.stepDown();

			if (product.BarcodeQty > 1) {
				product.BarcodeQty--;
			}
		}
	}

	changeQty(event: any, product: VMProduct) {
		var qty = event.target.value;
		if (qty) {
			qty = parseInt(qty);
			if (qty > product.Qty) {
				product.BarcodeQty = product.Qty;
			} else if (qty < 1) {
				product.BarcodeQty = 1;
			}
		}
	}

	onSubmit() {

		// this.objBarcode.lstSku = this.objBarcode.lstProduct.map(x => x.SKU);
		// this.objBarcode.Qty = this.objBarcode.lstProduct.map(x => x.BarcodeQty)?.reduce((a, b) => a + b);
		// debugger



		var group: any[] = []


		this.objBarcode.lstProduct.forEach((product, index) => {
			var tempList = [];
			for (let i = 0; i < product.BarcodeQty; i++) {
				var element = {
					sku: product.SKU,
					name: product.ProductName,
					price: product.FinalPrice
				}
				tempList.push(element);
			}

			group.push({
				group: product.ProductName,
				lstSku: [...tempList]
			})
		})

		this.objBarcode.sku = group;
	}

	resetBarcode() {
		this.objBarcode.sku = [];
	}

	clickToRemoveFromList(index: number) {
		this.objBarcode.lstProduct.splice(index, 1);
		// this.changeQty();
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
