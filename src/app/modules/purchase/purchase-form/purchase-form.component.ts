import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppConstant } from 'src/app/common/constants/appConstant';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMProduct } from 'src/app/models/VM/vmProduct';
import { Account } from 'src/app/models/account';
import { Purchase } from 'src/app/models/purchase';
import { Supplier } from 'src/app/models/supplier';
import { AccountService } from 'src/app/services/account.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
	selector: 'app-purchase-form',
	templateUrl: './purchase-form.component.html',
	styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('searchSupplier') searchSupplier: ElementRef;
	@ViewChild('searchProductText') searchProductText: ElementRef;
	purchaseCode: string = '';
	objPurchase: Purchase = new Purchase();
	lstSupplier: Supplier[] = [];
	lstAllSupplier: Supplier[] = [];
	selectedSupplier: Supplier = new Supplier();
	maxDate: Date;
	lstProduct: VMProduct[] = [];
	timeout: any = null;
	totalPurchaseQty: number = 0;
	discountInput: number = 0;
	lstAccount: Account[] = [];
	isEditMode: boolean = false;
	lstPurchaseStatus: any[] = AppConstant.PURCHASE_STATUS;
	lstDiscountType: any[] = AppConstant.DISCOUNT_TYPE;
	selectedStatus: any;
	selectedDiscountType: any;
	selectedPaymentType: Account = new Account();
	noMatchFound: string = '';

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private messageHelper: MessageHelper,
		private productService: ProductService,
		private supplierService: SupplierService,
		private accountService: AccountService,
		private purchaseService: PurchaseService,
		public dataService: DataService,
		private router: Router
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		var childRoute = "";
		this.activatedRoute.url.subscribe((params: Params) => {
			childRoute = params[0].path;
		})

		this.activatedRoute.params.subscribe((params: Params) => {
			this.purchaseCode = (!params['purchaseCode']) ? '' : params['purchaseCode'];
			if (this.purchaseCode != '') {
				this.isEditMode = true;
				setTimeout(() => {

					this.getPurchaseByCode(this.purchaseCode);
				}, 500);
			} else {
				this.isEditMode = false;
			}
		});
		Promise.resolve().then(() => this.headerService.setTitle(childRoute!.toString() + ' ' + headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllSupplier();
		this.getAllAccount();
		this.maxDate = new Date();
		this.objPurchase.PurchaseDate = new Date(this.maxDate).toLocaleString();
		this.selectedStatus = this.lstPurchaseStatus.filter(x => x.Id == this.objPurchase.PurchaseStatus)[0];
	}

	getPurchaseByCode(purchaseCode: string) {
		this.purchaseService.getPurchaseByPurchaseCode(purchaseCode).subscribe(response => {
			if (response.ResponseCode == ResponseStatus.success) {
				this.objPurchase = JSON.parse(JSON.stringify(response.ResponseObj));

				if (this.objPurchase.Discount > 0) {
					if (this.objPurchase.DiscountType == 1) {
						this.discountInput = (parseFloat(this.objPurchase.Discount.toString()) * 100) / parseFloat(this.objPurchase.SubTotal.toString());
						this.selectedDiscountType = this.lstDiscountType.filter(x => x.Id == this.objPurchase.DiscountType)[0];
					} else {
						this.discountInput = this.objPurchase.Discount;
					}
				}

				this.objPurchase.PurchaseDate = new Date(this.objPurchase.PurchaseDate).toLocaleString();
				this.selectedStatus = this.lstPurchaseStatus.filter(x => x.Id == this.objPurchase.PurchaseStatus)[0];
				this.selectedPaymentType = this.lstAccount.filter(x => x.AccountID == this.objPurchase.PaymentType)[0];
				this.changeQty();
			} else {
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
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
		this.productService.searchProduct(value)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstProduct = response.ResponseObj;
					this.noMatchFound = '';
				} else {
					this.noMatchFound = response.Message;
				}
			})
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

	getSupplierName() {
		setTimeout(() => {
			var existSupplier = this.lstAllSupplier.filter(x => x.SupplierID == this.objPurchase?.SupplierID)[0];
			if (existSupplier) {
				this.selectedSupplier = JSON.parse(JSON.stringify(existSupplier));
			}
		}, 500);
	}

	selectSupplier(supplier: Supplier) {
		if (supplier) {
			this.selectedSupplier = JSON.parse(JSON.stringify(supplier));
			this.objPurchase.SupplierID = supplier.SupplierID;
		} else {
			this.objPurchase.SupplierID = 0;
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

	productAddToPurchase(product: VMProduct) {
		if (product && product.SKU != '') {
			var existProduct = this.objPurchase.lstProduct.filter(x => x.SKU == product.SKU)[0];
			if (!existProduct) {
				product.Qty = 1;
				this.objPurchase.lstProduct.push(product);
				this.lstProduct = [];
				this.searchProductText!.nativeElement.value = '';

				this.changeQty();
			}
		}
	}

	clickToRemoveFromList(index: number) {
		this.objPurchase.lstProduct.splice(index, 1);
		this.changeQty();
	}

	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	changeQty() {
		if (this.objPurchase.lstProduct.length > 0) {
			this.totalPurchaseQty = this.objPurchase.lstProduct.map(p => p.Qty).reduce((a, b) => a + b);
			this.objPurchase.SubTotal = this.objPurchase.lstProduct.reduce((acc, obj) => acc + (obj.PurchasePrice * obj.Qty), 0);
		} else {
			this.totalPurchaseQty = 0;
			this.objPurchase.SubTotal = 0;
		}
		this.calculateTotalPrice();
	}

	calculateTotalPrice() {
		if (this.objPurchase.SubTotal == 0) {
			this.objPurchase.OtherCharge = 0;
			this.objPurchase.Discount = 0;
			this.discountInput = 0;
		}
		this.objPurchase.TotalPurchasePrice = (parseFloat(this.objPurchase.SubTotal.toString()) + parseFloat(this.objPurchase.OtherCharge.toString())) - parseFloat(this.objPurchase.Discount.toString());
	}

	discountCalculation() {
		if (this.discountInput > 0) {
			if (this.objPurchase.DiscountType == 1) {
				this.objPurchase.Discount = parseFloat(this.objPurchase.SubTotal.toString()) * (parseFloat(this.discountInput.toString()) / 100);
			} else {
				this.objPurchase.Discount = this.discountInput;
			}
		} else {
			this.objPurchase.Discount = 0;
		}
		this.calculateTotalPrice();
	}

	savePurchase() {
		if (!this.objPurchase.SupplierID) {
			this.messageHelper.showMessage(ResponseStatus.warning, 'Supplier field is required');
			return;
		}
		if (this.objPurchase.lstProduct.length == 0) {
			this.messageHelper.showMessage(ResponseStatus.warning, "Didn't select any product to purchase");
			return;
		}
		this.objPurchase.PurchaseDate = new Date(this.objPurchase.PurchaseDate).toLocaleString();
		if (this.objPurchase.PaymentAmount > 0) {
			if (this.objPurchase.PaymentType == 0) {
				this.messageHelper.showMessage(ResponseStatus.warning, "For payment, you have to select payment type");
				return;
			}
		}

		this.purchaseService.savePurchase(this.objPurchase)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.objPurchase = new Purchase();
					this.selectedSupplier = new Supplier();
					this.changeQty();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	clickCancel() {
		this.objPurchase = new Purchase();
		this.router.navigate(['purchase']);
	}

	incrementValue(event: Event, product: VMProduct) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector(`input[type="number"]#quantity_${product.SKU}`) as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			// inputElement.stepUp();

			product.Qty++;
			this.changeQty();
		}
	}
	decrementValue(event: Event, product: VMProduct) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector(`input[type="number"]#quantity_${product.SKU}`) as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			// inputElement.stepDown();

			if (product.Qty > 1) {
				product.Qty--;
			}
			this.changeQty();
		}
	}

	bindingUnderTotalPrice(event: any) {
		if (this.objPurchase.PaymentAmount > this.objPurchase.TotalPurchasePrice) {
			this.messageHelper.showMessage(ResponseStatus.warning, "Can't pay more than total purchase price");

			event.target.value = this.objPurchase.TotalPurchasePrice;
			this.objPurchase.PaymentAmount = this.objPurchase.TotalPurchasePrice;
		}
	}

	selectPurchaseStatus(event: any) {
		this.selectedStatus = this.lstPurchaseStatus.filter(x => x.Id == event.Id)[0];
		this.objPurchase.PurchaseStatus = event.Id;
	}
	selectDiscount(event: any) {
		if (event) {
			this.selectedDiscountType = this.lstDiscountType.filter(x => x.Id == event.Id)[0];
			this.objPurchase.DiscountType = event.Id;
		} else {
			this.objPurchase.DiscountType = 0;
		}
	}
	selectPayentType(event: any) {
		if (event) {
			this.selectedPaymentType = this.lstAccount.filter(x => x.AccountID == event.AccountID)[0];
			this.objPurchase.PaymentType = event.Id;
		} else {
			this.objPurchase.PaymentType = 0;
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
